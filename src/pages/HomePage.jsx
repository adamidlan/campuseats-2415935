import { useVendors } from "../hooks/useVendors.js";
import VendorCard from "../components/VendorCard.jsx";
import { Loading, ErrorMessage } from "../components/Status.jsx";
import DailySpecial from "../components/DailySpecial.jsx";
import { useCart } from "../hooks/useCart.js";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

function HomePage() {
  const { vendors, loading: vendorsLoading, error, reload } = useVendors();
  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  if (vendorsLoading || authLoading) return <Loading />;

  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const dailySpecials = vendors.flatMap((vendor) =>
    vendor.menu
      .filter((item) => item.isDailySpecial)
      .map((item) => ({
        ...item,
        vendorId: vendor.id,
        vendorName: vendor.name,
      })),
  );

  return (
    <section>
      {user ? (
        <>
          <h2 className="section-title">
            Today's special for {user.displayName || user.email}
          </h2>

          {dailySpecials.length === 0 ? (
            <p className="muted">No daily specials available.</p>
          ) : (
            <div className="vendor-grid">
              {dailySpecials.map((item) => (
                <DailySpecial
                  key={item.id}
                  item={item}
                  vendorId={item.vendorId}
                  vendorName={item.vendorName}
                  onAdd={addToCart}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="card">
          <h2 className="section-title">Log in to see today's specials</h2>

          <p className="muted">Sign in to see today's specials.</p>
        </div>
      )}
      <h2 className="section-title">Choose a vendor</h2>

      <div className="vendor-grid">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
    </section>
  );
}
export default HomePage;
