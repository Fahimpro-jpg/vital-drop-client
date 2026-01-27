import React from 'react';

const FeaturedSection = () => {
  const features = [
    {
      title: "Find Donors",
      description: "Quickly search for blood donors in your area and get help in time.",
      icon: "🩸",
    },
    {
      title: "Post Donation Requests",
      description: "Post your blood donation needs for urgent help and reach donors fast.",
      icon: "📢",
    },
    {
      title: "Save Lives",
      description: "Your contribution can save lives and make a difference.",
      icon: "❤️",
    },
    {
      title: "Join as Volunteer",
      description: "Help organize blood donation events and support the community.",
      icon: "🤝",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-primary mb-12">
        How You Can Help
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-base-100 rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition-transform transform hover:-translate-y-2 hover:shadow-xl duration-300"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
