import React from "react";
import NewsletterInput from "./NewsLetterInput";
import { toast, ToastContainer } from "react-toastify";
import styled from "@emotion/styled";
// import SubscribeButton from "./SubscribeButton";
export default function NewsLetter() {
  const [email, setEmail] = React.useState("");
  const handleSubscription = (e) => {
    e.preventDefault();

    if (email) {
      console.log("Submitted email:", email);
      setEmail("");
      toast("You have been subscribed to the newsletter");
      // Send toast message for successfull
    }
  };
  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        Subscribe now & get 10% off your next purchase
      </p>
      <p className="text-gray-400 mt-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem,
        quod.
      </p>
      <form
        className="w-full sm:w-1/2 flex items-stretch mx-auto my-6 sm:flex-row flex-col gap-4"
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
          SUBSCRIBE
        </button>
        {/* <SubscribeButton type="submit" onClick={() => alert("Clicked")}>
          SUBSCRIBE
        </SubscribeButton> */}
      </form>
      <ToastContainer />
    </div>
  );
}
