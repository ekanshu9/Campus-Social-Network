"use client";

import Navbar from "@/components/Navbar/Navbar";

const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="px-[150px] bg-black min-h-screen ">
        <div className="flex justify-center items-center py-[20px] text-center">
          <div>
            <h1 className="text-[45px] text-blue-600 font-semibold">
              Hello Everyone
            </h1>
            <p className="text-[20px]">
              For now if you guys have any queries, any questions and any
              suggestions about this website you can contact with me on{" "}
              <a
                className="text-blue-600 font-semibold"
                href="https://www.linkedin.com/in/ekanshu-kumar-5b2299204"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn.
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
