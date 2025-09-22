// import { FaArrowRight } from "react-icons/fa";

export default function BookCallButton({ 
  className = "text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center max-w-fit",
  children = "Book a Call"
}) {
  return (
    <a
      href="https://cal.com/sabyr-nurgaliyev/reddit-agency"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{ backgroundColor: "#ff4500" }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = "#e03e00")}
      onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff4500")}
    >
      {/* <FaArrowRight className="w-4 h-4 inline mr-2" /> */}
      {children}
    </a>
  );
}
