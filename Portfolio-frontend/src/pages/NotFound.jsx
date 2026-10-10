import React from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../utils/pageUtils';
import { Button } from '../components/UI';
import { Home, Wrench, BookOpen } from 'lucide-react';
import errorMascot from '../assets/Error.png';

export default function NotFound() {
  usePageTitle('Page Not Found');

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="flex justify-center">
        <img
          src={errorMascot}
          alt="Page not found"
          className="w-60 h-60 sm:w-80 sm:h-80 object-contain select-none pointer-events-none drop-shadow-lg"
        />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-normal text-text tracking-tight">
          Page not found.
        </h1>
        <p className="text-muted text-base max-w-md mx-auto leading-relaxed">
          The link you followed may be broken or the page might have been relocated to another section.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/">
          <Button variant="primary">
            <Home className="w-4 h-4 mr-2" /> Return to Home
          </Button>
        </Link>
        <Link to="/tools">
          <Button variant="secondary">
            <Wrench className="w-4 h-4 mr-2" /> Browse Tools
          </Button>
        </Link>
        <Link to="/blogs">
          <Button variant="secondary">
            <BookOpen className="w-4 h-4 mr-2" /> Read Blogs
          </Button>
        </Link>
      </div>
    </div>
  );
}
