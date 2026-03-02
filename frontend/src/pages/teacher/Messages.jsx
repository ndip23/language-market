import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import TeacherPaywallView from '../../components/TeacherPaywallView';
import MessagesLogic from '../student/Messages'; // This is the Unified Messenger we just fixed

const TeacherMessages = () => {
  const { user } = useContext(AuthContext);

  // 1. REVENUE GATE: Check if plan is active
  const hasPlan = user?.subscription?.plan && user?.subscription?.plan !== 'none';

  // 2. SHOW THE "ELITE HOOK" IF NO SUBSCRIPTION
  if (!hasPlan) {
    return (
      <TeacherPaywallView 
        title="Direct access to" 
        feature="Student Inquiries" 
        benefit="Connect with prospective students in real-time. Building early relationships through messaging is the #1 way to convert bookings."
      />
    );
  }

  // 3. SHOW THE ACTUAL MESSENGER IF SUBSCRIBED
  return <MessagesLogic />;
};

export default TeacherMessages;