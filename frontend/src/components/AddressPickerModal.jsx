import React, { useState, useEffect } from "react";
import Portal from "./Portal";
import { X, ChevronLeft, Plus, MapPin, Loader2 } from "lucide-react";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  mobile: "",
  address1: "",
  address2: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "",
};

export default function AddressPickerModal({
  isOpen,
  onClose,
  addresses,
  selectedAddressId,
  onSelect,
  onSaveNew,
  inputClass,
}) {
  const [view, setView] = useState("select"); // "select" | "add-new"
  const [localSelectedId, setLocalSelectedId] = useState(selectedAddressId);
  const [form, setForm] = useState(EMPTY_FORM);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setView(addresses.length > 0 ? "select" : "add-new");
      setLocalSelectedId(selectedAddressId);
      setForm(EMPTY_FORM);
      setSaving(false);
    }
  }, [isOpen]);

  // ponytail: pincode lookup duplicated from PlaceOrder — extract shared hook if a third consumer appears
  useEffect(() => {
    if (view !== "add-new") return;
    const pincode = form.pincode.trim();
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
          setForm((prev) => ({
            ...prev,
            city: po.District || po.Division || "",
            state: po.State || "",
          }));
        }
      })
      .catch(() => {})
      .finally(() => setPincodeLoading(false));

    return () => controller.abort();
  }, [form.pincode, view]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmSelect = () => {
    onSelect(localSelectedId);
    onClose();
  };

  const handleSaveNew = async () => {
    const required = ["firstName", "lastName", "mobile", "address1", "pincode", "city", "state"];
    if (required.some((f) => !form[f]?.trim())) return;
    setSaving(true);
    await onSaveNew(form);
    setSaving(false);
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {view === "add-new" && addresses.length > 0 && (
                <button
                  onClick={() => setView("select")}
                  className="flex items-center justify-center w-8 h-8 -ml-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <h3 className="text-lg font-semibold text-gray-900 !mb-0">
                {view === "select" ? "Select Address" : "New Address"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {view === "select" && (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    onClick={() => setLocalSelectedId(addr._id)}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      localSelectedId === addr._id
                        ? "border-black bg-white shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        localSelectedId === addr._id
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                    >
                      {localSelectedId === addr._id && (
                        <span className="w-2 h-2 rounded-full bg-black" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">
                          {addr.firstName} {addr.lastName}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {[addr.address1, addr.address2, addr.landmark]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {addr.city}, {addr.state} — {addr.pincode}
                      </p>
                      <p className="text-xs text-gray-400">{addr.mobile}</p>
                    </div>
                  </label>
                ))}

                {addresses.length < 5 && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm(EMPTY_FORM);
                      setView("add-new");
                    }}
                    className="flex items-center gap-3 w-full p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Add New Address
                    </span>
                  </button>
                )}
              </div>
            )}

            {view === "add-new" && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="First name"
                  />
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Last name"
                  />
                </div>
                <input
                  name="address1"
                  value={form.address1}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Address line 1"
                />
                <input
                  name="address2"
                  value={form.address2}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Address line 2"
                />
                <div className="flex gap-4">
                  <input
                    name="landmark"
                    value={form.landmark}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Landmark (optional)"
                  />
                  <input
                    name="mobile"
                    value={form.mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 11);
                      setForm((prev) => ({ ...prev, mobile: val }));
                    }}
                    className={inputClass}
                    placeholder="Mobile number"
                    type="tel"
                    inputMode="numeric"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="relative w-full">
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setForm((prev) => ({
                          ...prev,
                          pincode: val,
                          ...(val.length < 6 ? { city: "", state: "" } : {}),
                        }));
                      }}
                      className={inputClass}
                      placeholder="Pincode"
                      inputMode="numeric"
                    />
                    {pincodeLoading && (
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="City"
                  />
                </div>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="State"
                />
                {form.city && form.state && (
                  <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2.5">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Delivering to {form.city}, {form.state}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100">
            {view === "select" ? (
              <button
                onClick={handleConfirmSelect}
                disabled={!localSelectedId}
                className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deliver to this address
              </button>
            ) : (
              <button
                onClick={handleSaveNew}
                disabled={saving}
                className="w-full bg-black text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Save & Deliver Here"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
