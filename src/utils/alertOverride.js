import toast from "react-hot-toast";

export function overrideAlert() {
  window.alert = (message) => {
    toast(message, {
      duration: 3000,
      position: "top-center",
      style: {
        background: "#1f2937",
        color: "#fff",
        fontSize: "14px",
        borderRadius: "8px",
        padding: "12px 16px",
      },
    });
  };
}
