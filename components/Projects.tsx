import ProjectCard from "./ProjectCard";

const List = [
  {
    title: "HorizonStay",
    info: "This application emulates the management of a hotel, providing various functionalities needed for hotel operations. It is built with React and React-Query and connects to a Supabase API",
    src: "/horizonStay.png",
    link: "https://horizon-stay.vercel.app/",
    code: "https://github.com/souravkhan12/HorizonStay",
  },
  {
    title: "HorizonStay Client",
    info: "The HorizonStay is a user-friendly web application built with Next.js and React. It allows users to explore and book cabins in a serene, remote location. For a seamless experience, we've integrated NextAuth for secure Google logins.",
    src: "/HorizonC.png",
    link: "https://horizon-search-client.vercel.app/",
    code: "https://github.com/souravkhan12/horizonSearchFT",
  },
  {
    title: "AtlasLogs",
    info: "A world map that tracks your footsteps into every city you can think of. Developed as part of a React course, this project uses React, React-DOM, Leaflet, Vite, and CSS Modules.",
    src: "/AtlasLog.png",
    link: "https://atlas-logs-algw-caizdlp2u-sourav-khans-projects.vercel.app/",
    code: "https://github.com/souravkhan12/AtlasLogs",
  },
  {
    title: "ReactSwigZo",
    info: "This app emulates a pizza ordering service where users can select and order pizzas. Developed using React and Redux, it showcases basic functionalities such as state management and user interaction. This app was created as part of a course to learn the fundamentals of React and Redux.",
    src: "/pizzApp.png",
    link: "https://react-swig-zo.vercel.app/",
    code: "https://github.com/souravkhan12/React-SwigZo",
  },
];

export default function Projects() {
  return (
    <div id="projects">
      <h1 className="mb-12 text-xl text-gray-500 dark:text-gray-100">
        Projects
      </h1>
      <div className="flex flex-col justify-center gap-20">
        {List.map((L, idx) => (
          <ProjectCard
            key={idx}
            title={L.title}
            info={L.info}
            src={L.src}
            link={L.link}
            code={L.link}
            id={idx}
          />
        ))}
      </div>
    </div>
  );
}
