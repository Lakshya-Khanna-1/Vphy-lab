import Link from "next/link";
import { ArrowUpRight, GraduationCap } from "lucide-react";

const team = [
  {
    name: "Tushar Singh Ahluwalia",
    initials: "TA",
    role: "Core Simulation Developer",
    degree: "Computer Science & Engineering (Data Science)",
    socials: [
      ["LinkedIn", "https://www.linkedin.com/in/tushar-singh-ahluwalia/"],
      ["GitHub", "https://github.com/Tushar27-git"],
    ],
    experiments: [
      ["Newton’s rings", "/optics/newtons-rings"],
      ["Spectrometer", "/optics/spectrometer"],
    ],
  },
  {
    name: "Pranav Khera",
    initials: "PK",
    role: "Core Simulation Developer",
    degree: "Information Technology",
    socials: [
      ["LinkedIn", "https://www.linkedin.com/in/pranav-khera-745533281/"],
      ["GitHub", "https://github.com/Pranav2-4-7"],
    ],
    experiments: [
      ["Bar pendulum", "/oscillation/bar-pendulum"],
      ["Optical fibre", "/optics/fiber-aperture"],
    ],
  },
  {
    name: "Lakshya Khanna",
    initials: "LK",
    role: "Core Simulation Developer",
    degree: "Information Technology",
    socials: [
      ["LinkedIn", "https://www.linkedin.com/in/lakshya-khanna-ml/"],
      ["GitHub", "https://github.com/Lakshya-Khanna-1"],
    ],
    experiments: [["RC circuit", "/circuits/rc-circuit"]],
  },
  {
    name: "Yaksh Jindal",
    initials: "YJ",
    role: "Technical Support",
    degree: "Computer Science & Engineering (AI-ML)",
    socials: [
      ["LinkedIn", "https://www.linkedin.com/in/yaksh-jindal-50753237b/"],
    ],
    experiments: [],
  },
] as const;

export function ProjectCredits() {
  return (
    <section id="project-credits" className="v2-credits" aria-labelledby="team-title">
      <div className="section-heading">
        <div>
          <h2 id="team-title">The people behind the lab.</h2>
          <p>
            Research & development at Guru Tegh Bahadur Institute of Technology.
          </p>
        </div>
        <span className="v2-batch">GTBIT · Batch 2025–2029</span>
      </div>
      <h3 className="v2-team-title">Leading Developers</h3>
      <div className="v2-team-grid">
        {team.map((member) => (
          <article className="v2-person" key={member.name}>
            <div className="v2-initials">{member.initials}</div>
            <h4>{member.name}</h4>
            <strong>{member.role}</strong>
            <p>{member.degree}</p>
            {member.experiments.length > 0 && (
              <div className="v2-contributions">
                <span>Developed experiments</span>
                {member.experiments.map(([title, href]) => (
                  <Link href={href} key={href}>
                    {title}
                    <ArrowUpRight size={14} />
                  </Link>
                ))}
              </div>
            )}
            <small>GTBIT · 2025–2029</small>
            <div className="v2-socials">
              <span>Connect with us</span>
              <div className="v2-social-links">
                {member.socials.map(([platform, href]) => (
                  <a
                    href={href}
                    key={platform}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on ${platform} (opens in a new tab)`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      {platform === "LinkedIn" ? (
                        <path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.52 2.79-1.52 2.98 0 3.58 1.96 3.58 4.51v5.26Z" />
                      ) : (
                        <path d="M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.24c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.32c0 .32.22.7.82.58A12 12 0 0 0 12 .3Z" />
                      )}
                    </svg>
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      <section className="v2-mentor" aria-labelledby="mentor-title">
        <GraduationCap size={30} aria-hidden="true" />
        <div>
          <h3 id="mentor-title">Faculty mentor</h3>
          <h4>Dr. Daljeet Kaur</h4>
          <span>Department of Applied Sciences</span>
          <p>
            Academic leadership, curricular alignment, and experimental
            validation for the virtual laboratory.
          </p>
        </div>
        <span className="v2-mentor-note">
          Guru Tegh Bahadur Institute of Technology
        </span>
      </section>
      <section className="v2-leadership" aria-labelledby="leadership-title">
        <h3 id="leadership-title">With the support of</h3>
        <div className="v2-leadership-grid">
          {[
            { name: "Bibi Ranjeet Kaur", role: "Chairperson, GTBIT" },
            { name: "S. Amarjit Singh", role: "Co-chairman, GTBIT" },
            { name: "Dr. Rominder Kaur", role: "Director, GTBIT" },
            { name: "Prof. Simmi Singh", role: "HoD · Exam Cell" },
            { name: "Dr. Seema Singh", role: "HoD · First Year Academics" },
          ].map((leader) => (
            <div className="v2-leader" key={leader.name}>
              <h4>{leader.name}</h4>
              <p>{leader.role}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
