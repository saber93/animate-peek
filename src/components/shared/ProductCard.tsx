import { motion, type Variants } from "framer-motion";
import { Heart, ShoppingCart, Eye, PackageX } from "lucide-react";
import { Link } from "react-router-dom";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface ProductCardProps {
    product: ShopifyProduct;
    variants?: Variants;
}

export default function ProductCard({ product, variants }: ProductCardProps) {
    const { t } = useTranslation();
    const addItem = useCartStore(state => state.addItem);
    const isLoading = useCartStore(state => state.isLoading);
    const p = product.node;
    const image = p.images.edges[0]?.node;
    const price = parseFloat(p.priceRange.minVariantPrice.amount);
    const currency = p.priceRange.minVariantPrice.currencyCode;
    const variant = p.variants.edges[0]?.node;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!variant) return;
        await addItem({
            product,
            variantId: variant.id,
            variantTitle: variant.title,
            price: variant.price,
            quantity: 1,
            selectedOptions: variant.selectedOptions || [],
        });
        toast.success(t("general.cart.added", "Added to cart!"));
    };

    return (
        <motion.div
            variants={variants}
            className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        >
            <Link to={`/product/${p.handle}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-muted">
                    {image ? (
                        <img
                            src={image.url}
                            alt={image.altText || p.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <PackageX className="w-8 h-8 text-muted-foreground" />
                        </div>
                    )}

                    {/* Shine */}
                    <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100">
                        <div className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-shine" />
                    </div>

                    {/* Quick-action bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex justify-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-8 h-8 bg-background rounded-full flex items-center justify-center"
                            >
                                <Heart className="w-4 h-4 text-foreground" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleAddToCart}
                                disabled={isLoading}
                                className="w-8 h-8 bg-accent rounded-full flex items-center justify-center"
                            >
                                <ShoppingCart className="w-4 h-4 text-accent-foreground" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-8 h-8 bg-background rounded-full flex items-center justify-center"
                            >
                                <Eye className="w-4 h-4 text-foreground" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="p-3">
                <Link to={`/product/${p.handle}`}>
                    <h3 className="font-medium text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {p.title}
                    </h3>
                </Link>

                <div className="flex items-baseline gap-2">
                    <span className="font-bold text-primary">{currency} {price.toFixed(2)}</span>
                </div>
            </div>
        </motion.div>
    );
}
