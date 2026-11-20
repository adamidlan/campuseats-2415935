import { useEffect, useState } from "react";
import { subscribeToVendor, subscribeToMenu } from "../services/vendors.js";

export function useVendor(vendorId) {
  const [vendor, setVendor] = useState(undefined);
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stopVendor = subscribeToVendor(
      vendorId,
      (data) => setVendor(data),
      (err) => setError(err.message),
    );

    const stopMenu = subscribeToMenu(
      vendorId,
      (data) => setMenu(data),
      (err) => setError(err.message),
    );

    return () => {
      stopVendor();
      stopMenu();
    };
  }, [vendorId]);

  // Attach vendor name to every menu item
  const menuWithVendor = menu.map((item) => ({
    ...item,
    vendorName: vendor?.name,
  }));

  return {
    vendor,
    menu: menuWithVendor,
    loading: vendor === undefined && !error,
    error,
  };
}
