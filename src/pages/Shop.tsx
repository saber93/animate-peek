import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    SlidersHorizontal,
    Grid3X3,
    LayoutList,
    Loader2,
    PackageX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ProductCard from "@/components/shared/ProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: "easeOut" },
    },
};

export default function Shop() {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const { products, isLoading, error } = useShopifyProducts(50);

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main>
                {/* Hero Banner */}
                <div className="relative bg-gradient-to-r from-primary/90 to-primary overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                            }}
                        />
                    </div>
                    <div className="container mx-auto px-4 py-12 md:py-16 relative">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-4xl font-bold text-white mb-2"
                        >
                            {t("shop.all_products")}
                        </motion.h1>
                        <Breadcrumb
                            items={[{ label: t("shop.title"), href: "/shop" }]}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-8">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                        <span className="text-sm text-muted-foreground">
                            {products.length} {t("shop.products_count_label", "products")}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="icon"
                                className="w-9 h-9"
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="icon"
                                className="w-9 h-9"
                                onClick={() => setViewMode("list")}
                            >
                                <LayoutList className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Loading */}
                    {isLoading && (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="text-center py-20 text-destructive">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Empty */}
                    {!isLoading && !error && products.length === 0 && (
                        <div className="text-center py-20">
                            <PackageX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg text-muted-foreground">
                                {t("shop.no_products", "No products found")}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                {t("shop.add_products", "Add products to your Shopify store to display them here.")}
                            </p>
                        </div>
                    )}

                    {/* Products Grid */}
                    {!isLoading && products.length > 0 && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className={
                                viewMode === "grid"
                                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                                    : "grid grid-cols-1 md:grid-cols-2 gap-4"
                            }
                        >
                            {products.map((product) => (
                                <ProductCard
                                    key={product.node.id}
                                    product={product}
                                    variants={itemVariants}
                                />
                            ))}
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
