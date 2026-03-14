import { BASE_URL } from "./config";

export type Address = {
  id: number;
  label: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  is_default: boolean;
};

/* ---------------- FETCH ALL ADDRESSES ---------------- */
export const fetchAddresses = async (token: string): Promise<Address[]> => {
  try {
    const res = await fetch(`${BASE_URL}/addresses`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("GET addresses error:", text);
      throw new Error("Failed to fetch addresses");
    }

    return await res.json();
  } catch (err) {
    console.error("Network error (fetchAddresses):", err);
    throw err;
  }
};

/* ---------------- FETCH DEFAULT ADDRESS ---------------- */
export const fetchDefaultAddress = async (token: string): Promise<Address | null> => {
  try {
    const res = await fetch(`${BASE_URL}/addresses/default`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("DEFAULT address error:", text);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Network error (fetchDefaultAddress):", err);
    return null;
  }
};

/* ---------------- CREATE ADDRESS ---------------- */
export const createAddress = async (
  data: Partial<Address>,
  token: string
): Promise<Address> => {
  try {
    const res = await fetch(`${BASE_URL}/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("CREATE address error:", text);
      throw new Error("Failed to create address");
    }

    return await res.json();
  } catch (err) {
    console.error("Network error (createAddress):", err);
    throw err;
  }
};

/* ---------------- UPDATE ADDRESS ---------------- */
export const updateAddress = async (
  id: number,
  data: Partial<Address>,
  token: string
): Promise<Address> => {
  try {
    const res = await fetch(`${BASE_URL}/addresses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`UPDATE address error (id:${id})`, text);
      throw new Error("Failed to update address");
    }

    return await res.json();
  } catch (err) {
    console.error("Network error (updateAddress):", err);
    throw err;
  }
};

/* ---------------- DELETE ADDRESS ---------------- */
export const deleteAddress = async (
  id: number,
  token: string
): Promise<{ message: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/addresses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`DELETE address error (id:${id})`, text);
      throw new Error("Failed to delete address");
    }

    return await res.json();
  } catch (err) {
    console.error("Network error (deleteAddress):", err);
    throw err;
  }
};

/* ---------------- SET DEFAULT ADDRESS ---------------- */
export const setDefaultAddress = async (
  id: number,
  token: string
): Promise<Address> => {
  try {
    const res = await fetch(`${BASE_URL}/addresses/set-default/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`SET DEFAULT error (id:${id})`, text);
      throw new Error("Failed to set default address");
    }

    return await res.json();
  } catch (err) {
    console.error("Network error (setDefaultAddress):", err);
    throw err;
  }
};