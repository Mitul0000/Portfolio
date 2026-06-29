import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">About</h1>
      <p className="text-gray-400 mb-8">The person behind Digifello AI.</p>

      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full bg-indigo-700 flex items-center justify-center text-2xl font-bold text-white">
            D
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Digifello</h2>
            <p className="text-gray-400 text-sm">Developer · Creator · Builder</p>
          </div>
        </div>
        <p className="text-gray-300 leading-relaxed mb-4">
          I'm a full-stack developer passionate about building useful digital tools and sharing knowledge
          through technical writing. I work with Node.js, React, MongoDB, and a range of modern web technologies.
        </p>
        <p className="text-gray-300 leading-relaxed">
          This platform is where I share blogs on what I learn, publish tools I build, and take custom tool requests
          from clients and the community. If you have an idea for a tool — let's make it happen.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="card">
          <h3 className="text-white font-semibold mb-2">🛠 Skills</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>Node.js · Express.js</li>
            <li>React · Vite · Tailwind CSS</li>
            <li>MongoDB · Mongoose</li>
            <li>REST APIs · JWT Auth</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="text-white font-semibold mb-2">📬 Get in Touch</h3>
          <p className="text-gray-400 text-sm mb-3">
            Have a project idea or want to collaborate? Reach out or submit a tool request.
          </p>
          <Link to="/tool-request" className="btn-primary text-sm inline-block">Request a Tool</Link>
        </div>
      </div>
    </div>
  )
}
