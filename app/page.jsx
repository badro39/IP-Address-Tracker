"use client";

// styles
import styles from "./page.module.css";

// React hooks
import { useEffect, useMemo, useState } from "react";

// Next Components
import dynamic from "next/dynamic";

// Components
const Maps = dynamic(() => import("@/Components/Map"), { ssr: false });

// Hooks
import { useDeviceDetection } from "@/hooks/deviceDetection";

// Get User IP Address
const fetchIPAddress = async () => {
  try {
    const res = await fetch("https://api64.ipify.org?format=json");
    const { ip } = await res.json();
    return ip;
  } catch (error) {
    return null;
  }
};

const fetchLocation = async (input) => {
  try {
    if (!input) return null;

    const isIP = isValidIP(input);
    const query = isIP ? `ipAddress=${input}` : `domain=${input}`;
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.NEXT_PUBLIC_API_KEY}&${query}`
    );
    const data = await res.json();
    return {
      ip: data.ip || "",
      city: data.location.city || "",
      region: data.location.region || "",
      postalCode: data.location.postalCode || "",
      timezone: data.location.timezone || "",
      lat: data.location.lat || "",
      lng: data.location.lng || "",
      isp: data.isp || "",
    };
  } catch (err) {
    console.error("Error fetching location:", err);
    return null;
  }
};

const isValidIP = (input) => {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$|^([a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/;
  return ipRegex.test(input);
};

export default function Home() {
  // State variables
  const [input, setInput] = useState(null);
  const [position, setPosition] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);

  // Device detection
  const { isMobileOnly, isDesktop } = useDeviceDetection();

  // Fetch IP Address on mount
  useEffect(() => {
    const fetchData = async () => {
      const ip = await fetchIPAddress();
      if (ip) {
        setInput(ip);
        setSearch(ip);
      } else {
        setError(true);
        const timeout = setTimeout(() => {
          setError(false);
        }, 5000);
        return () => clearTimeout(timeout);
      }
    };

    fetchData();
  }, []);

  // Fetch location whenever IP address changes
  useEffect(() => {
    if (input) {
      const position = async () => {
        const pos = await fetchLocation(input);
        setPosition(pos);
      };
      position();
    }
  }, [input]);

  // Handle Enter key in search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setInput(search);
    }
  };

  // Extract position details
  const { ip, city, region, postalCode, timezone, lat, lng, isp } =
    position || {};

  const info = useMemo(
    () => [
      { name: "IP ADDRESS OR DOMAIN", value: ip || "Fetching..." },
      {
        name: "LOCATION",
        value: `${city || "N/A"}, ${region || "N/A"} ${postalCode || ""}`,
      },
      { name: "TIMEZONE", value: timezone ? `UTC ${timezone}` : "N/A" },
      { name: "ISP", value: isp || "N/A" },
    ],
    [ip, city, region, postalCode, timezone, isp]
  );

  return (
    <div>
      <header className={styles.header}>
        <div className="w-100 text-center">
          <h1 className="text-light py-3">IP Address Tracker</h1>
          <div className="d-flex m-auto col-lg-4 col-md-6 col-sm-8 col-9">
            <input
              type="search"
              placeholder="Search for any IP address or domain"
              className="border-0 text-muted flex-grow-1 rounded-start px-3 py-2"
              style={{ fontSize: "18px", outline: "none" }}
              onKeyDown={handleKeyDown}
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <i
              className="bi bi-chevron-right text-white rounded-end px-3 d-flex align-items-center"
              style={{
                backgroundColor: `var(--very-dark-gray)`,
                cursor: "pointer",
              }}
              onClick={() => setInput(search)}
            ></i>
          </div>
        </div>
      </header>

      <main
        style={{ height: "65dvh" }}
        className="d-flex justify-content-center"
      >
        {error && (
          <div
            className="position-absolute alert alert-danger py-3 px-4"
            style={{ zIndex: "3", left: "2%", bottom: "2%" }}
            role="alert"
          >
            <i className="bi bi-x"></i>
            <span>Error fetching ip address</span>
          </div>
        )}
        <div
          className={`col-lg-8 col-md-10 col-sm-8 col-9 bg-white rounded-4 position-absolute ${
            !isDesktop ? "text-center" : ""
          }`}
          style={{ bottom: `${isMobileOnly ? "40" : "55"}%`, zIndex: "3" }}
        >
          <ul className="p-0 d-lg-flex d-md-flex justify-content-around d-block">
            {info.map(({ name, value }, index) => (
              <li
                key={index}
                className="my-lg-5 my-md-5 my-4 px-lg-4 px-md-2 col-lg-3 col-md-3 col-12"
                style={{ borderRight: "1px solid #eee" }}
              >
                <p
                  className="m-0 fw-medium"
                  style={{
                    fontSize: ".65rem",
                    color: "var(--dark-gray)",
                    letterSpacing: ".1rem",
                  }}
                >
                  {name}
                </p>
                <p className="fw-bold m-0">{value}</p>
              </li>
            ))}
          </ul>
        </div>
        <Maps position={position ? [lat, lng] : [32.69922, -117.11281]} />
      </main>
    </div>
  );
}
