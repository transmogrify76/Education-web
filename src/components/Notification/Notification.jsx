import React from 'react';
import styled from 'styled-components';

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
  margin-bottom: 30px;
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

const Notification = () => {
  const navigateToEventPage = () => {
    window.location.href = '/event'; // Replace with the actual URL of your event page
  };

  return (
    <Container>
      <NotificationCard>
        <Gradient />
        <Title>Important Announcement</Title>
        <Message>
          Dear students and parents,
          <br />
          We are excited to announce that our school will be hosting a special event next week. All students are encouraged to attend and participate in the various activities planned for the occasion.
        </Message>
        <Button onClick={navigateToEventPage}>Learn More</Button>
      </NotificationCard>
      <LearnMoreSection>
        <h2>Learn More About the Event</h2>
        <p>
          For more information about the event, including the schedule, activities, and registration details, please visit our <LearnMoreLink href="#">Event Page</LearnMoreLink>.
        </p>
      </LearnMoreSection>
    </Container>
  );
};

export default Notification;