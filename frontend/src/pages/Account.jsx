import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { ShopContext } from "../context/ShopContext";
import OrdersList from "../components/OrdersList";
import Title from "../components/Title";
import {
  ShoppingBag,
  User,
  LogOut,
  Mail,
  MapPin,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Account() {
  const {
    token,
    setToken,
    orders,
    getUserOrders,
    backendUrl,
    addresses,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useContext(ShopContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [pageReady, setPageReady] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  // Address editing state
  const [editingAddressId, setEditingAddressId] = useState(null); // null = not editing, "new" = adding, addressId = editing
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    address1: "",
    address2: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    isDefault: false,
  });
  const [addressSaving, setAddressSaving] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [originalAddressForm, setOriginalAddressForm] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const emptyAddressForm = {
    firstName: "",
    lastName: "",
    mobile: "",
    address1: "",
    address2: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    isDefault: false,
  };

  // Fetch orders when switching to orders tab
  useEffect(() => {
    if (activeTab === "orders" && token) {
      getUserOrders(token);
    }
  }, [activeTab]);

  const handleRefreshOrders = async () => {
    if (token) return await getUserOrders(token);
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPageReady(true));
    });
  }, []);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getProfile = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/profile",
        {},
        { headers: { token } },
      );

      if (response.data.success) {
        setProfile({
          name: response.data?.user?.name || "",
          email: response.data?.user?.email || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    getProfile();
  }, [token]);

  // Address form handlers
  const startAddAddress = () => {
    setEditingAddressId("new");
    setAddressForm({ ...emptyAddressForm, isDefault: addresses.length === 0 });
  };

  const startEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    const formValues = {
      firstName: addr.firstName || "",
      lastName: addr.lastName || "",
      mobile: addr.mobile || "",
      address1: addr.address1 || "",
      address2: addr.address2 || "",
      landmark: addr.landmark || "",
      pincode: addr.pincode || "",
      city: addr.city || "",
      state: addr.state || "",
      isDefault: addr.isDefault || false,
    };
    setAddressForm(formValues);
    setOriginalAddressForm(formValues);
  };

  const cancelEdit = () => {
    setEditingAddressId(null);
    setAddressForm(emptyAddressForm);
    setOriginalAddressForm(null);
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressSave = async () => {
    const required = [
      "firstName",
      "lastName",
      "mobile",
      "address1",
      "pincode",
      "city",
      "state",
    ];
    const missing = required.filter((f) => !addressForm[f]?.trim());
    if (missing.length > 0) return;

    if (editingAddressId !== "new" && originalAddressForm) {
      const hasChanges = Object.keys(addressForm).some(
        (key) => addressForm[key] !== originalAddressForm[key],
      );
      if (!hasChanges) {
        cancelEdit();
        return;
      }
    }

    setAddressSaving(true);
    let result;
    if (editingAddressId === "new") {
      result = await addAddress(addressForm);
    } else {
      result = await updateAddress(editingAddressId, addressForm);
    }
    setAddressSaving(false);

    if (result?.success) {
      toast.success(
        editingAddressId === "new"
          ? "Address added successfully"
          : "Address updated successfully",
      );
      cancelEdit();
    } else {
      toast.error(result?.message || "Something went wrong");
    }
  };

  const handleDeleteAddress = (addressId, addressName) => {
    setPendingDelete({ addressId, addressName });
  };

  const confirmDelete = async () => {
    if (pendingDelete) {
      const result = await deleteAddress(pendingDelete.addressId);
      if (result?.success) {
        toast.success("Address deleted successfully");
      } else {
        toast.error(result?.message || "Failed to delete address");
      }
      if (editingAddressId === pendingDelete.addressId) cancelEdit();
      setPendingDelete(null);
    }
  };

  // PinCode fetch details for address form
  useEffect(() => {
    if (editingAddressId === null) return;
    const pincode = addressForm.pincode.trim();
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) return;

    const controller = new AbortController();
    setPincodeLoading(true);

    fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          setAddressForm((prev) => ({
            ...prev,
            city: po.District || po.Division || "",
            state: po.State || "",
          }));
        }
      })
      .catch(() => {})
      .finally(() => setPincodeLoading(false));

    return () => controller.abort();
  }, [addressForm.pincode, editingAddressId]);

  const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "addresses", label: "Addresses", icon: MapPin },
    { key: "orders", label: "Orders", icon: ShoppingBag },
  ];

  const inputClass =
    "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none transition-colors placeholder:text-gray-400 focus:border-black bg-white";

  return (
    <div
      className={`pt-10 border-t border-gray-300 pb-16 transition-opacity duration-500 ${pageReady ? "opacity-100" : "opacity-0"}`}
    >
      <div className="text-center text-3xl">
        <Title text1={"MY"} text2={"ACCOUNT"} />
      </div>

      <div className="flex flex-col sm:flex-row gap-8 pt-8">
        {/* Sidebar */}
        <div className="sm:w-56 flex-shrink-0">
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <nav className="flex flex-row sm:flex-col">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-3 w-full px-5 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  <ChevronRight
                    className={`w-4 h-4 ml-auto hidden sm:block ${activeTab === tab.key ? "text-white" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </nav>

            <div className="border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-5 py-4 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* ─── Profile Tab ─── */}
          {activeTab === "profile" && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-6">
                Personal Information
              </h4>

              <div className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      value={profile.name}
                      disabled
                      className="w-full px-4 py-3 pl-11 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 text-gray-700 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-3 pl-11 text-sm border border-gray-200 rounded-xl outline-none bg-gray-50 text-gray-700 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Addresses Tab ─── */}
          {activeTab === "addresses" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-medium text-gray-900">
                  Saved Addresses
                </h4>
                {editingAddressId === null && addresses.length < 5 && (
                  <button
                    onClick={startAddAddress}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </button>
                )}
              </div>

              {addresses.length === 0 && editingAddressId === null && (
                <div className="text-center py-12 text-gray-400">
                  <MapPin className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No saved addresses yet</p>
                  <button
                    onClick={startAddAddress}
                    className="mt-4 text-sm font-medium text-black underline underline-offset-4"
                  >
                    Add your first address
                  </button>
                </div>
              )}

              {addresses.length >= 5 && editingAddressId === null && (
                <p className="text-xs text-gray-400 mb-4">
                  Maximum 5 addresses reached. Delete one to add a new address.
                </p>
              )}

              {/* Inline Add Form (at top) */}
              {editingAddressId === "new" && (
                <div className="border border-black rounded-2xl p-5 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-sm font-semibold text-gray-900">
                      New Address
                    </h5>
                    <button
                      onClick={cancelEdit}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {renderAddressForm()}
                </div>
              )}

              {/* Address Cards */}
              <div className="space-y-4">
                {addresses.map((addr) =>
                  editingAddressId === addr._id ? (
                    <div
                      key={addr._id}
                      className="border border-black rounded-2xl p-5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-sm font-semibold text-gray-900">
                          Edit Address
                        </h5>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {renderAddressForm()}
                    </div>
                  ) : (
                    <div
                      key={addr._id}
                      className="border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-sm font-medium text-gray-900">
                              {addr.firstName} {addr.lastName}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-semibold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {[addr.address1, addr.address2, addr.landmark]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                          <p className="text-sm text-gray-500">
                            {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            {addr.mobile}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => startEditAddress(addr)}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit address"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteAddress(
                                addr._id,
                                `${addr.firstName} ${addr.lastName}`,
                              )
                            }
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {/* ─── Orders Tab ─── */}
          {activeTab === "orders" && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-6">
                Your Orders
              </h4>
              <OrdersList onRefresh={handleRefreshOrders} />
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setPendingDelete(null)}
          />
          <div className="relative bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-xl">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Address?
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  <span className="font-medium text-gray-700">
                    {pendingDelete.addressName.endsWith("s")
                      ? `${pendingDelete.addressName}'`
                      : `${pendingDelete.addressName}'s`}
                  </span>{" "}
                  address will be permanently deleted.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setPendingDelete(null)}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Keep Address
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );

  function renderAddressForm() {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <input
            name="firstName"
            value={addressForm.firstName}
            onChange={handleAddressChange}
            className={inputClass}
            placeholder="First name"
            required
          />
          <input
            name="lastName"
            value={addressForm.lastName}
            onChange={handleAddressChange}
            className={inputClass}
            placeholder="Last name"
            required
          />
        </div>

        <input
          name="address1"
          value={addressForm.address1}
          onChange={handleAddressChange}
          className={inputClass}
          placeholder="Address line 1"
          required
        />

        <input
          name="address2"
          value={addressForm.address2}
          onChange={handleAddressChange}
          className={inputClass}
          placeholder="Address line 2"
        />

        <div className="flex gap-4">
          <input
            name="landmark"
            value={addressForm.landmark}
            onChange={handleAddressChange}
            className={inputClass}
            placeholder="Landmark (optional)"
          />
          <input
            name="mobile"
            value={addressForm.mobile}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 11);
              setAddressForm((prev) => ({ ...prev, mobile: val }));
            }}
            className={inputClass}
            placeholder="Mobile number"
            type="tel"
            inputMode="numeric"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="relative w-full">
            <input
              name="pincode"
              value={addressForm.pincode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setAddressForm((prev) => ({
                  ...prev,
                  pincode: val,
                  ...(val.length < 6 ? { city: "", state: "" } : {}),
                }));
              }}
              className={inputClass}
              placeholder="Pincode"
              inputMode="numeric"
              required
            />
            {pincodeLoading && (
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>
          <input
            name="city"
            value={addressForm.city}
            onChange={handleAddressChange}
            className={inputClass}
            placeholder="City"
            required
          />
        </div>

        <input
          name="state"
          value={addressForm.state}
          onChange={handleAddressChange}
          className={inputClass}
          placeholder="State"
          required
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={addressForm.isDefault}
            onChange={handleAddressChange}
            disabled={
              addresses.length === 0 ||
              addresses.length === 1 ||
              (editingAddressId !== "new" && addressForm.isDefault)
            }
            className="w-4 h-4 accent-black disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label
            htmlFor="isDefault"
            className={`text-sm ${
              addresses.length === 0 ||
              addresses.length === 1 ||
              (editingAddressId !== "new" && addressForm.isDefault)
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
            Set as default address
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleAddressSave}
            disabled={addressSaving}
            className="px-6 py-3 text-sm font-medium uppercase tracking-wider bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {addressSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {editingAddressId === "new" ? "Save Address" : "Update Address"}
          </button>
          <button
            type="button"
            onClick={cancelEdit}
            className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}
