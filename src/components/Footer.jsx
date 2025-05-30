import { MarkGithubIcon } from "@primer/octicons-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 py-4 rounded-xl border-10 border-dashed border-blue-500">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; 2025 Argf. All rights reserved.</p>
        <p className="text-sm mt-3">Built with React, Tailwind CSS, and Firebase</p>
        <div className="mt-3 flex justify-center">
          <a href="https://github.com/argf013" target="_blank" rel="noopener noreferrer" className="text-gray-800 mx-2 hover:text-blue-600">
            <MarkGithubIcon size={24} />
          </a>
          <a href="https://www.linkedin.com/in/muhamad-arfa-alghiffari-706419208/" target="_blank" rel="noopener noreferrer" className="text-gray-800 mx-2 hover:text-blue-600">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 32 32">
              <path d="M17.303,14.365c0.012-0.015,0.023-0.031,0.031-0.048v0.048H17.303z M32,0v32H0V0H32L32,0z M9.925,12.285H5.153v14.354
                h4.772V12.285z M10.237,7.847c-0.03-1.41-1.035-2.482-2.668-2.482c-1.631,0-2.698,1.072-2.698,2.482
                c0,1.375,1.035,2.479,2.636,2.479h0.031C9.202,10.326,10.237,9.222,10.237,7.847z M27.129,18.408c0-4.408-2.355-6.459-5.494-6.459
                c-2.531,0-3.664,1.391-4.301,2.368v-2.032h-4.77c0.061,1.346,0,14.354,0,14.354h4.77v-8.016c0-0.434,0.031-0.855,0.157-1.164
                c0.346-0.854,1.132-1.746,2.448-1.746c1.729,0,2.418,1.314,2.418,3.246v7.68h4.771L27.129,18.408L27.129,18.408z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;