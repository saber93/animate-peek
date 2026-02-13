import { useTranslation } from "react-i18next";
import SideDrawer from "../shared/SideDrawer";
import { X, Plus, Minus, ShoppingBag, Loader2, ExternalLink } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useEffect } from "react";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { t } = useTranslation();
    const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
    const currency = items[0]?.price.currencyCode || 'USD';

    useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

    const handleCheckout = () => {
        const checkoutUrl = getCheckoutUrl();
        if (checkoutUrl) {
            window.open(checkoutUrl, '_blank');
            onClose();
        }
    };

    return (
        <SideDrawer isOpen={isOpen} onClose={onClose} title={t("general.cart.title")}>
            <div className="flex flex-col h-full space-y-6">
                {items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">{t("general.cart.empty", "Your cart is empty")}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Shipping notice */}
                        <div className="bg-accent/10 p-4 border border-accent/20 text-center">
                            <p className="text-sm font-medium">
                                🔥 {t("general.cart.shipping_notice")}
                            </p>
                            <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-accent transition-all duration-1000"
                                    style={{ width: `${Math.min((totalPrice / 100) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto divide-y divide-border pe-2 -me-2 component-scrollbar">
                            {items.map((item) => (
                                <div key={item.variantId} className="py-6 flex gap-4 group">
                                    <div className="w-24 h-24 bg-muted overflow-hidden flex-shrink-0">
                                        {item.product.node.images?.edges?.[0]?.node && (
                                            <img
                                                src={item.product.node.images.edges[0].node.url}
                                                alt={item.product.node.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h5 className="font-bold text-foreground leading-tight line-clamp-2">
                                                    {item.product.node.title}
                                                </h5>
                                                <button
                                                    onClick={() => removeItem(item.variantId)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors ms-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                                                {item.selectedOptions.map(o => o.value).join(' / ')}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center border border-border h-8">
                                                <button
                                                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                                    className="px-2 h-full hover:bg-muted transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                                    className="px-2 h-full hover:bg-muted transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <span className="font-bold text-primary">
                                                {currency} {(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="pt-6 border-t border-border space-y-4">
                            <div className="flex justify-between items-center bg-muted/30 p-4">
                                <span className="text-lg font-bold uppercase tracking-widest">{t("general.cart.subtotal")}</span>
                                <span className="text-2xl font-black text-primary">{currency} {totalPrice.toFixed(2)}</span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={handleCheckout}
                                    disabled={isLoading || isSyncing}
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 transition-all hover:gap-4 group disabled:opacity-50"
                                >
                                    {isLoading || isSyncing ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {t("general.cart.checkout")}
                                            <ExternalLink className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </SideDrawer>
    );
}
