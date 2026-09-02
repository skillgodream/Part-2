import React, { createContext, useContext, useState, useEffect } from 'react';
import { enrollmentStore } from './enrollmentStore';

export type ScreenName =
  | 'home'
  | 'onboarding-welcome'
  | 'onboarding-details'
  | 'onboarding-otp'
  | 'choose-skill'
  | 'skill-detail'
  | 'role-detail'
  | 'choose-plan'
  | 'personal-details'
  | 'payment'
  | 'payment-success'
  | 'course-modules'
  | 'module-video'
  | 'module-quiz'
  | 'practical-training'
  | 'practical-payment'
  | 'practical-payment-success'
  | 'course-complete'
  | 'final-assessment'
  | 'training-viewer'
  | 'certificate'
  | 'verify-certificate'
  | 'my-learning'
  | 'my-dashboard'
  | 'library'
  | 'library-detail'
  | 'growth-plan'
  | 'support'
  | 'careers'
  | 'interview-prep'
  | 'skillgo-english'
  | 'english-target'
  | 'english-practice-home'
  | 'english-practice-translate'
  | 'english-practice-answer'
  | 'english-practice-real'
  | 'english-practice-library'
  | 'profile';

export interface RouteState {
  screen: ScreenName;
  params?: Record<string, any>;
}

interface RouterContextType {
  currentRoute: RouteState;
  navigate: (screen: ScreenName, params?: Record<string, any>) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

const getInitialRouteState = (): RouteState => {
  const onboarded = enrollmentStore.isOnboarded();
  return {
    screen: onboarded ? 'home' : 'onboarding-welcome',
    params: {},
  };
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<RouteState[]>([getInitialRouteState()]);

  const currentRoute = history[history.length - 1] || { screen: 'home', params: {} };

  const navigate = (screen: ScreenName, params: Record<string, any> = {}) => {
    const doNavigate = () => {
      setHistory(prev => [...prev, { screen, params }]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    if (document.startViewTransition) {
      document.startViewTransition(doNavigate);
    } else {
      doNavigate();
    }
  };

  const goBack = () => {
    const doGoBack = () => {
      setHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    if (document.startViewTransition) {
      document.startViewTransition(doGoBack);
    } else {
      doGoBack();
    }
  };

  // Scroll to top on navigation
  useEffect(() => {
    // window.scrollTo(0, 0); // REMOVED to prevent infinite loop
  }, [currentRoute.screen]);

  return (
    <RouterContext.Provider value={{ currentRoute, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
