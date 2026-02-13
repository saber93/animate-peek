import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Heart, ShoppingCart, Eye, Star, Loader2, PackageX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function HotDealProducts() {
  const { t } = useTranslation();
  const { products, isLoading, error } = useShopifyProducts(6);
  const addItem = useCartStore(state => state.addItem);
  const cartLoading = useCartStore(state => state.isLoading);

  const handleAddToCart = async (product: typeof products[0]) => {
    const variant = product.node.variants.edges[0]?.node;
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <span className="inline-block px-4 py-1 bg-accent/20 text-accent-foreground text-sm font-medium rounded-full mb-4">
              {t('hotDeals.badge')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t('hotDeals.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('hotDeals.description')}
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-4 md:mt-0 w-fit border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            asChild
          >
            <Link to="/shop">{t('hotDeals.viewAll')}</Link>
          </Button>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 text-destructive">
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <PackageX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">{t('hotDeals.noProducts', 'No products found')}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('hotDeals.addProducts', 'Add products to your Shopify store to display them here.')}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && products.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
          >
            {products.map((product) => {
              const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
              const currency = product.node.priceRange.minVariantPrice.currencyCode;
              const image = product.node.images.edges[0]?.node;

              return (
                <motion.div
                  key={product.node.id}
                  variants={itemVariants}
                  className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Image Container */}
                  <Link to={`/product/${product.node.handle}`} className="relative aspect-square overflow-hidden bg-muted block">
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText || product.node.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PackageX className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}

                    {/* Shine Effect */}
                    <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100">
                      <div className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-shine" />
                    </div>

                    {/* Quick Actions */}
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={cartLoading}
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
                  </Link>

                  {/* Product Info */}
                  <div className="p-3">
                    <Link to={`/product/${product.node.handle}`}>
                      <h3 className="font-medium text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {product.node.title}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-primary">{currency} {price.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
