"use client";
import mission from "@/assests/mission.png";
import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";

const About = () => {
  return (
    <>
      <Navbar />
      <div>
        <div className="px-[150px] bg-black min-h-screen text-white">
          <div className="flex flex-col justify-center items-center pt-[20px] ">
            <h1 className="text-[36px] font-bold">About PeerView</h1>
            <p className="text-[20px]">
              Connecting MCA Students for Growth and Collaboration
            </p>
          </div>
          <div className="flex justify-center items-center">
            <Image height={350} src={mission} alt="Our Mission" />
            <div>
              <h1 className="text-[40px] font-semibold">Our Mission</h1>
              <p>
                At PeerView, we aim to empower MCA students by providing a
                platform where they can showcase their skills, projects, and
                professional profiles. Our goal is to foster collaboration and
                networking within our community.
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center text-center">
            <div>
              <h1 className="font-semibold text-[35px] text-blue-600">
                Important Update: Changes in Progress
              </h1>
              <p className="text-[20px]">
                There are currently many changes and additions that I need to
                make to this platform, but your participation is essential to
                its growth. I kindly request you to register yourself here and
                share this with your friends from KALKA MCA to help expand our
                community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
