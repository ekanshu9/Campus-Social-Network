"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";

const Akash = () => {
  useEffect(() => {
    const token = Cookies.get("token");
    // console.log(token);
  }, []);
  return <div>Akash</div>;
};

export default Akash;
