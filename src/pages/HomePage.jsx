import { useEffect, useState } from "react";
import { useVendors } from "../hooks/useVendors.js";
import { subscribeToMenu } from "../services/vendors.js";
import VendorCard from "../components/VendorCard.jsx";
import { Loading, ErrorMessage } from "../components/Status.jsx";
import DailySpecial from "../components/DailySpecial.jsx";
import { useCart } from "../hooks/useCart.js";
import { useAuth } from "../hooks/useAuth.js";

function HomePage() {
  const { vendors, loading: vendorsLoading, error, reload } = useVendors();
  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [menus, setMenus] = useState({});
  const [menusLoading, setMenusLoading] = useState(true);
  const [menuError, setMenuError] = useState(null);

  useEffect(() => {
    if (!user || vendorsLoading) {
      setMenus({});
      setMenusLoading(false);
      return;
    }

    if (vendors.length === 0) {
      setMenus({});
      setMenusLoading(false);
      return;
    }

    setMenus({});
    setMenusLoading(true);
    setMenuError(null);

    const loadedVendors = new Set();
    let remaining = vendors.length;

    const unsubscribes = vendors.map((vendor) =>
      subscribeToMenu(
        vendor.id,
        (data) => {
          setMenus((previous) => ({
            ...previous,
            [vendor.id]: data.map((item) => ({
              ...item,
              vendorName: vendor.name,
            })),
          }));

          if (!loadedVendors.has(vendor.id)) {
            loadedVendors.add(vendor.id);
            remaining--;

            if (remaining === 0) {
              setMenusLoading(false);
            }
          }
        },
        (err) => {
          setMenuError(err.message);

          if (!loadedVendors.has(vendor.id)) {
            loadedVendors.add(vendor.id);
            remaining--;

            if (remaining === 0) {
              setMenusLoading(false);
            }
          }
        },
      ),
    );

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [vendors, vendorsLoading, user]);

  if (vendorsLoading || authLoading) return <Loading />;

  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const dailySpecials = Object.values(menus)
    .flat()
    .filter((item) => item.special === true);

  return (
    <section>
      {user ? (
        <>
          <h2 className="section-title">
            Today's special for {user.displayName || user.email}
          </h2>

          {menuError && <ErrorMessage message={menuError} />}

          {menusLoading ? (
            <Loading />
          ) : dailySpecials.length === 0 ? (
            <p className="muted">No daily specials available.</p>
          ) : (
            <div className="vendor-grid">
              {dailySpecials.map((item) => (
                <DailySpecial
                  key={`${item.vendorId}-${item.id}`}
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
