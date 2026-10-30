import { useVendors } from "../hooks/useVendors.js";
import VendorCard from "../components/VendorCard.jsx";
import { Loading, ErrorMessage } from "../components/Status.jsx";
import DailySpecial from "../components/DailySpecial.jsx";
import { useCart } from "../hooks/useCart.js";

function HomePage() {
  const { vendors, loading, error, reload } = useVendors();
  const { addToCart } = useCart();
  if (loading) return <Loading />;
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
      <h2 className="section-title">Today's Specials</h2>

      {dailySpecials.length === 0 ? (
        <p className="muted">No daily specials available.</p>
      ) : (
        <div className="vendor-grid">
          {dailySpecials.map((item) => (
            <DailySpecial
              key={item.id}
              item={item}
              endTime={item.endTime}
              vendorId={item.vendorId}
              vendorName={item.vendorName}
              onAdd={addToCart}
            />
          ))}
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
