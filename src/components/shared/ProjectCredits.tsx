import Link from "next/link";
import { ArrowUpRight, GraduationCap } from "lucide-react";

const team = [
  {
    name: "Tushar Singh Ahluwalia",
    initials: "TA",
    role: "Core Simulation Developer",
    degree: "Computer Science & Engineering (Data Science)",
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
    experiments: [["RC circuit", "/circuits/rc-circuit"]],
  },
  {
    name: "Yaksh Jindal",
    initials: "YJ",
    role: "Technical Support",
    degree: "Computer Science & Engineering (AI-ML)",
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
      <section className="v2-leadership" aria-labelledby="leadership-title">
        <h3 id="leadership-title">With the support of</h3>
        <div className="v2-leadership-grid">
          {[
            { name: "Bibi Ranjeet Kaur", role: "Chairperson, GTBIT" },
            { name: "S. Amarjeet Singh", role: "Co-chairman, GTBIT" },
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
      <div className="v2-team-grid">
        {team.map((member) => (
          <article className="v2-person" key={member.name}>
            <div className="v2-initials">{member.initials}</div>
            <h3>{member.name}</h3>
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
          </article>
        ))}
      </div>
    </section>
  );
}
