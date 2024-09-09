import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  font-family: 'Montserrat', sans-serif;
  padding: 20px;
  background-color: #f2f2f2;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NotificationCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 80%;
  max-width: 600px;
  position: relative;
  overflow: hidden;
`;

const Gradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #ff6b6b, #ffa500, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff);
  background-size: 200% 200%;
  animation: gradient 10s ease infinite;
  z-index: -1;
  opacity: 0.3;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const Title = styled.h1`
  font-size: 2.5em;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const Message = styled.p`
  font-size: 1.2em;
  color: #666;
  line-height: 1.5;
  margin-bottom: 10px;
  text-align: center;
`;

const DateText = styled.p`
  font-size: 1em;
  color: #999;
  margin-bottom: 10px;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1em;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const Button = styled.button`
  background-color: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff4d4d;
  }
`;

const LearnMoreSection = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const LearnMoreLink = styled.a`
  font-size: 1.1em;
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #666;
  }
`;

const LoadingMessage = styled.p`
  font-size: 1.2em;
  color: #666;
`;

const ErrorMessage = styled.p`
  font-size: 1.2em;
  color: #ff4d4d;
`;

const Notification = () => {
  const [notificationData, setNotificationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/notification')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setNotificationData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleLearnMoreClick = (notificationId) => {
    navigate(`/event/${notificationId}`); // Navigate to the event page with the specific notification ID
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return <Container><LoadingMessage>Loading...</LoadingMessage></Container>;
  }

  if (error) {
    return <Container><ErrorMessage>Error fetching notifications: {error}</ErrorMessage></Container>;
  }

  return (
    <Container>
      {notificationData.length > 0 ? (
        notificationData.map((notification) => (
          <NotificationCard key={notification.id}>
            <Gradient />
            <Title>{notification.title}</Title>
            <Message>{notification.message}</Message>
            <DateText>{formatDate(notification.date)}</DateText>
            <Description>{notification.description || 'No description available.'}</Description>
            <Button onClick={() => handleLearnMoreClick(notification.id)}>
              Learn More
            </Button>
          </NotificationCard>
        ))
      ) : (
        <p>No notifications available.</p>
      )}
      <LearnMoreSection>
        <h2>Learn More About the Events</h2>
        <p>
          For more information about the events, including the schedule, activities, and registration details, please visit our <LearnMoreLink href="/event">Event Page</LearnMoreLink>.
        </p>
      </LearnMoreSection>
    </Container>
  );
};

export default Notification;
