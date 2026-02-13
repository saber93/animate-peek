import { useState } from "react";
import { useTranslation } from "react-i18next";
import SideDrawer from "../shared/SideDrawer";
import { Input } from "@/components/ui/input";
import { Search, Loader2, PackageX } from "lucide-react";
import { Link } from "react-router-dom";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";

interface SearchDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
    const { t } = useTranslation();
    const [query, setQuery] = useState("");

    const { products, isLoading } = useShopifyProducts(5, query || undefined);

    return (
        <SideDrawer isOpen={isOpen} onClose={onClose} title={t("general.search.title")}>
            <div className="space-y-8">
                <div className="relative">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t("general.search.placeholder")}
                        className="pe-12 h-14 text-lg border-2 focus-visible:ring-primary rounded-none"
                        autoFocus
                    />
                    <Search className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
                </div>

                <div className="space-y-4">
                    <h4 className="font-bold uppercase tracking-widest text-sm text-muted-foreground">
                        {query ? t("general.search.results") : t("general.search.suggested")}
                    </h4>

                    {isLoading && (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    )}

                    {!isLoading && (
                        <div className="divide-y divide-border">
                            {products.map((product) => {
                                const p = product.node;
                                const image = p.images.edges[0]?.node;
                                const price = parseFloat(p.priceRange.minVariantPrice.amount);
                                const currency = p.priceRange.minVariantPrice.currencyCode;

                                return (
                                    <Link
                                        key={p.id}
                                        to={`/product/${p.handle}`}
                                        onClick={onClose}
                                        className="group flex gap-4 py-4 items-center"
                                    >
                                        <div className="w-20 h-20 bg-muted overflow-hidden flex-shrink-0">
                                            {image ? (
                                                <img
                                                    src={image.url}
                                                    alt={image.altText || p.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <PackageX className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                                {p.title}
                                            </h5>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="font-bold text-primary">
                                                    {currency} {price.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}

                            {query && products.length === 0 && !isLoading && (
                                <p className="py-8 text-center text-muted-foreground">
                                    {t("general.search.no_results", { query })}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {query && products.length > 0 && (
                    <Link
                        to={`/shop?q=${query}`}
                        onClick={onClose}
                        className="block text-center py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
                    >
                        {t("general.search.view_all")}
                    </Link>
                )}
            </div>
        </SideDrawer>
    );
}
