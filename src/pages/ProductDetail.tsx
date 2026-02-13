import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    ShoppingCart,
    Share2,
    Minus,
    Plus,
    ChevronLeft,
    ChevronRight,
    Truck,
    RotateCcw,
    Shield,
    Loader2,
    PackageX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5 },
    }),
};

interface ShopifyProductDetail {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
        minVariantPrice: { amount: string; currencyCode: string };
    };
    images: {
        edges: Array<{ node: { url: string; altText: string | null } }>;
    };
    variants: {
        edges: Array<{
            node: {
                id: string;
                title: string;
                price: { amount: string; currencyCode: string };
                availableForSale: boolean;
                selectedOptions: Array<{ name: string; value: string }>;
            };
        }>;
    };
    options: Array<{ name: string; values: string[] }>;
}

export default function ProductDetail() {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const { handle } = useParams<{ handle: string }>();

    const [product, setProduct] = useState<ShopifyProductDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

    const addItem = useCartStore(state => state.addItem);
    const cartLoading = useCartStore(state => state.isLoading);

    useEffect(() => {
        let cancelled = false;
        async function fetchProduct() {
            setIsLoading(true);
            setError(null);
            try {
                const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
                if (!cancelled && data?.data?.product) {
                    const p = data.data.product;
                    setProduct(p);
                    // Set default options
                    const defaults: Record<string, string> = {};
                    p.options.forEach((opt: { name: string; values: string[] }) => {
                        if (opt.values.length > 0) defaults[opt.name] = opt.values[0];
                    });
                    setSelectedOptions(defaults);
                } else if (!cancelled) {
                    setError("Product not found");
                }
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load product");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        if (handle) fetchProduct();
        return () => { cancelled = true; };
    }, [handle]);

    // Find matching variant based on selected options
    const selectedVariant = product?.variants.edges.find(v =>
        v.node.selectedOptions.every(opt => selectedOptions[opt.name] === opt.value)
    )?.node || product?.variants.edges[0]?.node;

    const images = product?.images.edges || [];
    const price = selectedVariant ? parseFloat(selectedVariant.price.amount) : 0;
    const currency = selectedVariant?.price.currencyCode || 'USD';

    const handleAddToCart = async () => {
        if (!product || !selectedVariant) return;
        await addItem({
            product: { node: product },
            variantId: selectedVariant.id,
            variantTitle: selectedVariant.title,
            price: selectedVariant.price,
            quantity,
            selectedOptions: selectedVariant.selectedOptions,
        });
        toast.success(t("general.cart.added", "Added to cart!"));
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setZoomPosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex justify-center items-center py-40">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    // Not found
    if (error || !product) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <PackageX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-foreground mb-4">
                        {t("product.not_found")}
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        {t("product.not_found_text")}
                    </p>
                    <Button asChild>
                        <Link to="/shop">{t("product.back_to_shop")}</Link>
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main>
                {/* Breadcrumb */}
                <div className="container mx-auto px-4">
                    <Breadcrumb
                        items={[
                            { label: t("shop.title"), href: "/shop" },
                            { label: product.title },
                        ]}
                    />
                </div>

                {/* Product Section */}
                <section className="container mx-auto px-4 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Image Gallery */}
                        <motion.div
                            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div
                                className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-4 cursor-crosshair"
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                                onMouseMove={handleMouseMove}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        src={images[selectedImage]?.node.url}
                                        alt={images[selectedImage]?.node.altText || product.title}
                                        className="w-full h-full object-cover"
                                        style={
                                            isZoomed
                                                ? { transform: "scale(2)", transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                                                : {}
                                        }
                                    />
                                </AnimatePresence>

                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setSelectedImage((prev) => prev > 0 ? prev - 1 : images.length - 1)}
                                            className="absolute start-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                                        >
                                            <ChevronLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                                        </button>
                                        <button
                                            onClick={() => setSelectedImage((prev) => prev < images.length - 1 ? prev + 1 : 0)}
                                            className="absolute end-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                                        >
                                            <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                                                ? "border-primary ring-2 ring-primary/30"
                                                : "border-transparent hover:border-muted-foreground/30"
                                                }`}
                                        >
                                            <img
                                                src={img.node.url}
                                                alt={img.node.altText || `${product.title} view ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Product Info */}
                        <motion.div initial="hidden" animate="visible" className="space-y-6">
                            <motion.h1
                                variants={fadeUp}
                                custom={0}
                                className="text-2xl md:text-3xl font-bold text-foreground leading-tight"
                            >
                                {product.title}
                            </motion.h1>

                            {/* Price */}
                            <motion.div variants={fadeUp} custom={1} className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-primary">
                                    {currency} {price.toFixed(2)}
                                </span>
                                {selectedVariant && !selectedVariant.availableForSale && (
                                    <span className="text-sm text-destructive font-medium">
                                        {t("product.out_of_stock", "Out of stock")}
                                    </span>
                                )}
                            </motion.div>

                            {/* Description */}
                            <motion.p
                                variants={fadeUp}
                                custom={2}
                                className="text-muted-foreground leading-relaxed"
                            >
                                {product.description}
                            </motion.p>

                            {/* Options */}
                            {product.options.map((option, optIdx) => (
                                option.values.length > 1 && (
                                    <motion.div key={option.name} variants={fadeUp} custom={3 + optIdx}>
                                        <label className="text-sm font-medium text-foreground mb-3 block">
                                            {option.name}:{" "}
                                            <span className="text-primary">{selectedOptions[option.name]}</span>
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {option.values.map((value) => (
                                                <button
                                                    key={value}
                                                    onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                                                    className={`min-w-[44px] h-10 px-3 rounded-lg border text-sm font-medium transition-all ${selectedOptions[option.name] === value
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-border text-foreground hover:border-primary"
                                                        }`}
                                                >
                                                    {value}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )
                            ))}

                            {/* Quantity + Add to Cart */}
                            <motion.div variants={fadeUp} custom={6} className="flex flex-col sm:flex-row gap-4">
                                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="w-11 h-11 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-14 h-11 flex items-center justify-center text-sm font-medium text-foreground border-x border-border">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity((q) => q + 1)}
                                        className="w-11 h-11 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <Button
                                    size="lg"
                                    className="flex-1 h-11 gap-2 text-base"
                                    onClick={handleAddToCart}
                                    disabled={cartLoading || !selectedVariant?.availableForSale}
                                >
                                    {cartLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-5 h-5" />
                                            {t("product.add_to_cart")}
                                        </>
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-11 w-11 p-0 shrink-0"
                                >
                                    <Heart className="w-5 h-5" />
                                </Button>
                            </motion.div>

                            {/* Trust badges */}
                            <motion.div
                                variants={fadeUp}
                                custom={7}
                                className="grid grid-cols-3 gap-4 pt-4 border-t border-border"
                            >
                                <div className="text-center">
                                    <Truck className="w-6 h-6 mx-auto mb-1 text-primary" />
                                    <p className="text-xs text-muted-foreground">{t("product.free_shipping")}</p>
                                </div>
                                <div className="text-center">
                                    <RotateCcw className="w-6 h-6 mx-auto mb-1 text-primary" />
                                    <p className="text-xs text-muted-foreground">{t("product.easy_returns")}</p>
                                </div>
                                <div className="text-center">
                                    <Shield className="w-6 h-6 mx-auto mb-1 text-primary" />
                                    <p className="text-xs text-muted-foreground">{t("product.secure_checkout")}</p>
                                </div>
                            </motion.div>

                            {/* Share */}
                            <motion.div variants={fadeUp} custom={8} className="flex items-center gap-3">
                                <Share2 className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{t("product.share")}:</span>
                                <div className="flex gap-2">
                                    {["Facebook", "Twitter", "Pinterest"].map((social) => (
                                        <button
                                            key={social}
                                            className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
                                        >
                                            {social}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
