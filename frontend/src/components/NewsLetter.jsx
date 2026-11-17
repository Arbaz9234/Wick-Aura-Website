import React from "react";
import NewsletterInput from "./NewsletterInput";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

export default function NewsLetter() {
  const [email, setEmail] = React.useState("");

  const { backendUrl } = React.useContext(ShopContext);
  const [loading, setLoading] = React.useState(false);

  const handleSubscription = async (e) => {
    e.preventDefault();
    console.log(email);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || loading) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/subscription/subscribe`,
        { email: trimmedEmail },
      );

      if (response.data.success) {
        setEmail("");
        toast.success(
          response.data.message || "You have been subscribed to the newsletter",
        );
      } else {
        toast.error(response.data.message || "Subscription failed.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to subscribe right now. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center my-10">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & get 10% off your next purchase
      </p>
      <p className="text-gray-600 mt-3 w-3/4 sm:w-full m-auto">
        Be the first to know about new scents, seasonal collections, and
        exclusive offers.
      </p>
      <form
        className="w-full sm:w-3/4 lg:w-1/2 flex items-stretch mx-auto my-6 sm:flex-row flex-col gap-4"
        onSubmit={handleSubscription}
      >
        <NewsletterInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="bg-black text-white px-10 py-4 text-xs min-h-[56px] hover:bg-gray-800 transition"
        >
          {loading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "SUBSCRIBE"
          )}
        </button>
      </form>
    </div>
  );
}
