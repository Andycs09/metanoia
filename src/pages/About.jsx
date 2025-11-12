import { useEffect, useState } from 'react';
import './About.css';
import bgImage from '../assets/home page theme.png';

// Import faculty photos
import vinayPhoto from '../assets/vinay.jpg';
import deepaPhoto from '../assets/deepa.jpg';
import gayathryPhoto from '../assets/gayathry.jpg';
import mithunPhoto from '../assets/mithun.jpg';
import thonatdariPhoto from '../assets/thonatdari.jpg';

export default function About() {
  const [visibleSections, setVisibleSections] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => [...prev, entry.target.id]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.about-section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const facultyMembers = [
    {
      id: 1,
      name: 'Dr. Vinay M',
      designation: 'Professor & Head of Department',
      linkedin: 'https://www.linkedin.com/in/quickvinay/',
      photo: vinayPhoto,
    },
    {
      id: 2,
      name: 'Dr. Deepa S',
      designation: 'President',
      linkedin: 'https://www.linkedin.com/in/deepa-s-703390167/',
      photo: deepaPhoto,
    },
    {
      id: 3,
      name: 'Dr. Gayathry S Warrier',
      designation: 'Vice President',
      linkedin: 'https://www.linkedin.com/in/dr-gayathry-s-warrier-2153a018/',
      photo: gayathryPhoto,
    },
    {
      id: 4,
      name: 'Dr. Thontadari C',
      designation: 'Faculty Coordinator',
      linkedin: 'https://www.linkedin.com/in/thontadari-c-computer-science-yeshwanthpur-14b5a6350/',
      photo: thonatdariPhoto,
    },
    {
      id: 5,
      name: 'Dr. Mithun D Souza',
      designation: 'Faculty Coordinator',
      linkedin: '#',
      photo: mithunPhoto,
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="about-page" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* UnoVerse Section */}
      <section
        id="unoverse"
        className={`about-section ${visibleSections.includes('unoverse') ? 'visible' : ''}`}
      >
        <div className="section-container">
          <h2 className="section-heading">METANOIA</h2>
          <div className="section-content">
            <p>
              'Metanoia' stands as the pinnacle event within the realm of Samagra, the Computer
              Science Association. It is a celebration of innovation, a gathering of minds eager
              to push the boundaries of technology and creativity. From November 23rd to November
              24th, 2025, participants and spectators alike are invited to immerse themselves in
              a spectacular showcase of intellect and ingenuity.
            </p>
            <p>
              This flagship event brings together students, professionals, and technology enthusiasts
              from across the nation to participate in cutting-edge competitions, workshops, and
              collaborative projects. UnoVerse is more than just an event—it's a universe of
              possibilities where ideas transform into reality.
            </p>
          </div>
        </div>
      </section>

      {/* Samagra Section */}
      <section
        id="samagra"
        className={`about-section alt-bg ${visibleSections.includes('samagra') ? 'visible' : ''}`}
      >
        <div className="section-container">
          <h2 className="section-heading">SAMAGRA - COMPUTER SCIENCE ASSOCIATION</h2>
          <div className="section-content">
            <p>
              Samagra, the Computer Science Association, stands as the vibrant hub of our computer
              science department, teeming with an enthusiasm for excellence and an unwavering
              commitment to innovation. Comprising a vibrant community of students, faculty, and
              enthusiasts alike, Samagra serves as a catalyst for intellectual growth and
              technological advancement.
            </p>
            <p>
              Through a diverse array of events, workshops, hackathons, and seminars, Samagra
              fosters an environment where creativity flourishes and collaboration thrives. Our
              association is dedicated to nurturing the next generation of tech leaders, providing
              platforms for skill development, networking, and real-world problem-solving.
            </p>
            <p>
              From coding competitions to tech talks by industry experts, Samagra bridges the gap
              between academic learning and practical application, ensuring our members are
              well-equipped to excel in the ever-evolving world of technology.
            </p>
          </div>
        </div>
      </section>

      {/* Department Section */}
      <section
        id="department"
        className={`about-section ${visibleSections.includes('department') ? 'visible' : ''}`}
      >
        <div className="section-container">
          <h2 className="section-heading">DEPARTMENT OF COMPUTER SCIENCE</h2>
          <div className="section-content">
            <p>
              The Department of Computer Science at Christ University stands as a beacon of
              academic excellence and innovation in technology education. Our department is
              committed to providing world-class education that combines theoretical foundations
              with practical, industry-relevant skills.
            </p>
            <p>
              <strong>Our Mission:</strong> To cultivate critical thinking, foster innovation,
              and develop skilled professionals who can address complex technological challenges
              in an ever-changing digital landscape. We strive to create an inclusive learning
              environment that encourages diversity of thought and promotes collaborative
              problem-solving.
            </p>
            <p>
              <strong>Academic Excellence:</strong> Our curriculum is designed to stay ahead of
              industry trends, incorporating emerging technologies such as Artificial Intelligence,
              Machine Learning, Cloud Computing, Cybersecurity, and Data Science. With state-of-the-art
              laboratories, experienced faculty, and strong industry partnerships, we ensure our
              students receive a comprehensive education that prepares them for successful careers
              in technology.
            </p>
            <p>
              <strong>Diversity & Inclusion:</strong> We celebrate diversity and believe that
              varied perspectives drive innovation. Our department welcomes students from all
              backgrounds, fostering an environment where everyone can thrive and contribute to
              the advancement of computer science.
            </p>
          </div>
        </div>
      </section>

      {/* Faculty in Charge Section */}
      <section
        id="faculty"
        className={`about-section alt-bg ${visibleSections.includes('faculty') ? 'visible' : ''}`}
      >
        <div className="section-container">
          <h2 className="section-heading">FACULTY IN CHARGE</h2>
          <div className="faculty-grid">
            {facultyMembers.map((faculty) => (
              <article key={faculty.id} className="faculty-card">
                <div className="faculty-photo">
                  {faculty.photo ? (
                    <img src={faculty.photo} alt={faculty.name} />
                  ) : (
                    <div className="faculty-placeholder">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="faculty-info">
                  <h3 className="faculty-name">{faculty.name}</h3>
                  <p className="faculty-designation">{faculty.designation}</p>
                  <a
                    href={faculty.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="linkedin-link"
                    aria-label={`LinkedIn profile of ${faculty.name}`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span>Connect on LinkedIn</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <button
        className="back-to-top"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </div>
  );
}