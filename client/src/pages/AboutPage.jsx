import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaUsers,
  FaHandshake,
  FaShoppingBasket,
  FaCheck,
  FaInstagram
} from "react-icons/fa";

// Update your team members here
// Team image assets
import { member1, member2, member3, member4 } from "../assets";

const teamMembers = [
  {
    id: 1,
    name: "Daksh Saini",
    pic: member1,
    instagram: "https://www.instagram.com/iamdakshsainii/",
    linkedin: "https://www.linkedin.com/in/daksh-saini/",
  },
  {
    id: 2,
    name: "Saurabh Yadav",
    pic: member2,
    instagram: "https://www.instagram.com/thesaurabhyadavv/",
    linkedin: "https://www.linkedin.com/in/thesaurabhyadavv/",
  },
  {
    id: 3,
    name: "Vaidehi Gupta",
    pic: member3,
    instagram: "https://www.instagram.com/no/",
    linkedin: "https://www.linkedin.com/in/no/",
  },
  {
    id: 4,
    name: "Ashish Soni",
    pic: member4,
    instagram: "https://www.instagram.com/ashishsoni/",
    linkedin: "https://www.linkedin.com/in/ashishsoni/",
  },
];


const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col md:flex-row-reverse items-center bg-gradient-to-br from-blue-50 to-white overflow-hidden">
        <div className="md:w-1/2 flex justify-center items-center py-8">
          <FaLeaf className="text-blue-400 text-[8rem] drop-shadow-xl rotate-12" />
        </div>
        <div className="md:w-1/2 text-left px-8 py-16 space-y-5">
          <span className="uppercase tracking-widest bg-blue-100 text-blue-700 font-bold px-4 py-1 rounded-md shadow-blue-50 shadow-sm">
            Our Story
          </span>
          <h1 className="text-5xl font-black text-blue-900 mb-4 border-l-8 border-blue-400 pl-4">
            About KrishiCart
          </h1>
          <p className="text-xl text-blue-800">
            Connecting local farmers with consumers to promote sustainable
            agriculture and strengthen community bonds.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse items-center bg-white rounded-xl shadow-blue-200 shadow-lg border-l-8 border-blue-300">
            <div className="md:w-1/2 text-left p-8">
              <h2 className="text-4xl font-extrabold text-blue-700 mb-5 leading-tight">
                Our Mission
              </h2>
              <p className="text-blue-900 text-lg mb-4">
                KrishiCart was founded with a simple yet powerful mission: to
                create a direct link between local farmers and consumers. We
                believe everyone deserves access to fresh, locally grown produce
                and farmers deserve fair compensation.
              </p>
              <p className="text-blue-800 text-lg">
                By eliminating middlemen and creating a transparent marketplace,
                we're building a sustainable food system that benefits both
                producers and consumers while reducing environmental impact.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center py-8">
              <div className="w-60 h-60 bg-blue-100 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300 border-8 border-blue-200">
                <FaLeaf className="text-blue-500 text-8xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Timeline style) */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-14 text-blue-900 underline underline-offset-8">
          How It Works
        </h2>
        <div className="flex items-center justify-center gap-8 flex-wrap md:flex-nowrap px-4">
          {[
            {
              icon: <FaUsers className="text-blue-600 text-4xl" />,
              label: "Connect",
              description:
                "Farmers create profiles. Consumers discover local farms.",
            },
            {
              icon: <FaShoppingBasket className="text-blue-600 text-4xl" />,
              label: "Order",
              description:
                "Consumers browse, select items, and place orders with farmers.",
            },
            {
              icon: <FaHandshake className="text-blue-600 text-4xl" />,
              label: "Enjoy",
              description:
                "Receive fresh produce and build bonds with your local growers.",
            },
          ].map((step, idx) => (
            <div key={step.label} className="flex flex-col items-center relative">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-200 shadow-md">
                {step.icon}
              </div>
              <span className="mt-3 text-blue-900 font-semibold border-b-2 border-blue-400 pb-1">
                {step.label}
              </span>
              <p className="mt-2 text-sm text-blue-600 text-center max-w-[180px]">
                {step.description}
              </p>
              {/* Blue line connectors */}
              {idx !== 2 && (
                <div className="absolute right-[-45px] top-1/2 transform -translate-y-1/2 hidden md:block">
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-200 to-blue-500"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mb-20 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
          Benefits
        </h2>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 bg-blue-50 border border-blue-200 p-8 rounded-xl shadow-blue-100 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              For Consumers
            </h3>
            <ul className="space-y-3 text-blue-700">
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-2" />
                Access to fresher, more nutritious produce
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-2" />
                Know where your food comes from
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-2" />
                Support local economy and sustainability
              </li>
            </ul>
          </div>
          <div className="flex-1 bg-blue-50 border border-blue-200 p-8 rounded-xl shadow-blue-100 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              For Farmers
            </h3>
            <ul className="space-y-3 text-blue-700">
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-2" />
                Higher profits with no middlemen
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-2" />
                Demand planning and waste reduction
              </li>
              <li className="flex items-start">
                <FaCheck className="text-blue-600 mt-1 mr-2" />
                Build long-term customer trust
              </li>
            </ul>
          </div>
        </div>
      </section>

     /* Team Section: Carousel */
<section className="mb-32 px-4">
  <h2 className="text-4xl font-bold text-center mb-4 text-blue-900">
    Meet Our Team
  </h2>
  <p className="text-center text-blue-600 text-xl mb-12">
    Passionate people behind KrishiCart
  </p>
  <div className="flex flex-row overflow-x-auto space-x-8 py-4 scrollbar-thin scrollbar-thumb-blue-300">
    {teamMembers.map((member) => (
      <div
        key={member.id}
        className="min-w-[220px] bg-white rounded-xl border-4 border-blue-400 shadow-blue-200 shadow-lg flex flex-col items-center p-6 group relative transition-transform hover:scale-105"
      >
        {/* Square Image */}
        <div className="w-32 h-32 rounded-xl overflow-hidden mb-4 bg-blue-100 flex items-center justify-center">
          <img
            src={member.pic}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-base font-semibold mb-3 text-blue-900">
          {member.name}
        </h3>
        {/* Social Icons Below */}
        <div className="flex flex-row gap-4 mt-2">
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-600 hover:text-white text-blue-700 transition"
            title="LinkedIn"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/>
            </svg>
          </a>
          <a
            href={member.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 hover:bg-pink-500 hover:text-white text-pink-500 transition"
            title="Instagram"
          >
            <FaInstagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white px-8 py-16 rounded-xl mx-2 mb-10 flex flex-col items-center shadow-xl">
        <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
        <p className="text-xl max-w-2xl text-white/90 text-center mb-8">
          Whether you're a farmer or consumer, KrishiCart is made for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/register"
            className="bg-white text-blue-700 font-bold rounded-full px-8 py-3 hover:bg-blue-700 hover:text-white transition"
          >
            Sign Up Now
          </Link>
          <Link
            to="/products"
            className="border-2 border-white text-white font-bold rounded-full px-8 py-3 hover:bg-white hover:text-blue-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
