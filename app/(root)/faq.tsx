import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const FAQ = () => {
    return (
        <SafeAreaView className='h-full bg-white'>
            <ScrollView style={styles.container}>
                <Text style={styles.header}>Frequently Asked Questions (FAQs)</Text>

                <Text style={styles.subHeader}>General Questions</Text>
                <Text style={styles.question}>What is TrainerHub?</Text>
                <Text style={styles.answer}>TrainerHub is a platform designed to connect trainees with credible trainers for various sports and fitness training sessions. Offering booking, payment management, and rating functionalities for a seamless experience.</Text>

                <Text style={styles.question}>How do I create an account?</Text>
                <Text style={styles.answer}>To create an account, go to the registration page and provide the required details, including your email address, name, and password. Trainers will also need to submit verification details.</Text>

                <Text style={styles.question}>Is TrainerHub free to use?</Text>
                <Text style={styles.answer}>TrainerHub is free to browse and sign up. However, booking sessions with trainers requires payment based on their set rates.</Text>

                <Text style={styles.question}>What Sports are offered Training Sessions?</Text>
                <Text style={styles.answer}>TrainerHub focuses on sports namely Golf, Basketball, Tennis, & Physical Fitness Training. Additionally, trainees & trainers can submit a sport they’re interested in and the administrators will verify the need for the sport to be added into the application based on its demand, fan-base, & trainer availability.</Text>

                <Text style={styles.question}>How can Trainees know that the Trainers are credible?</Text>
                <Text style={styles.answer}>Apart from the qualifications, rating system and user reviews shown on the Trainer profiles, Trainers go through background checks upon submission of their application as well as a Credential Verification Process wherein they submit their credentials such as certifications and/or ID for verification by the administrators.</Text>

                <Text style={styles.subHeader}>Trainer Browsing and Selection</Text>
                <Text style={styles.question}>How can I browse trainers on TrainerHub?</Text>
                <Text style={styles.answer}>You can browse trainers by selecting your preferred sport. The platform allows you to filter trainers based on location, ratings, availability, and expertise to find the best match for your needs.</Text>

                <Text style={styles.question}>Can I search for trainers in my specific location?</Text>
                <Text style={styles.answer}>Yes, TrainerHub enables you to filter trainers based on your location, ensuring that you can connect with professionals near you for in-person sessions.</Text>

                <Text style={styles.question}>Can I see trainers outside of my selected location?</Text>
                <Text style={styles.answer}>No, TrainerHub only displays trainers available within your selected location. If you change your location, the list of available trainers will update accordingly. Trainers also receive booking requests only from users within their set service area.</Text>

                <Text style={styles.question}>Can I favorite or save trainers for later?</Text>
                <Text style={styles.answer}>Yes, You can bookmark or favorite trainers to easily revisit their profiles and book sessions later.</Text>

                <Text style={styles.subHeader}>Scheduling and Appointments</Text>
                <Text style={styles.question}>How do I book a training session?</Text>
                <Text style={styles.answer}>To book a session, select a trainer from your desired sport, choose an available time slot, and confirm the booking. Automated reminders about upcoming sessions along with the session venue/details will be sent before your session.</Text>

                <Text style={styles.question}>Can I reschedule or cancel a session?</Text>
                <Text style={styles.answer}>User-Initiated Rescheduling: You can reschedule a session at least 24 hours before the scheduled time without penalty. Trainer-Initiated Rescheduling: Trainers may reschedule due to unforeseen circumstances. You will be notified and given the option to accept the new schedule or request a refund.</Text>

                <Text style={styles.question}>What happens if I miss my session?</Text>
                <Text style={styles.answer}>If you fail to attend a session without canceling in advance, you may be charged a penalty or the full session fee.</Text>

                <Text style={styles.subHeader}>Payments and Refunds</Text>
                <Text style={styles.question}>What payment methods are supported?</Text>
                <Text style={styles.answer}>TrainerHub supports payments through GCash & Face-to-Face Cash payments after the session is adjourned.</Text>

                <Text style={styles.question}>How does the refund process work?</Text>
                <Text style={styles.answer}>Refunds will be processed within 5-7 business days through the original payment method or via GCash if the payment was made in GCash. Users will receive a confirmation email once the refund has been processed.</Text>

                <Text style={styles.question}>What happens if a trainer cancels a session?</Text>
                <Text style={styles.answer}>If a trainer cancels without a valid reason, you will receive a full refund, and their rating may be affected.</Text>

                <Text style={styles.question}>How does the Trainer Subscription Model work?</Text>
                <Text style={styles.answer}>TrainerHub does not require trainers to pay a fixed monthly fee. Instead, the platform operates on a commission-based model, where a percentage of each completed booking is automatically deducted as a service fee. This ensures trainers only pay when they earn. The deducted commission fee varies depending on factors such as session duration & system maintenance. The exact percentage is displayed in the trainer's dashboard.</Text>

                <Text style={styles.question}>How can Trainers manage their payment stream?</Text>
                <Text style={styles.answer}>Trainers can manage their earnings through the TrainerHub dashboard, where they can track bookings, payments, and pending transactions. The platform ensures automated commission deductions and scheduled payouts.</Text>

                <Text style={styles.question}>Where can users locate their receipts?</Text>
                <Text style={styles.answer}>Users can locate their receipts in their Appointment History, their completed session/appointment serving as their transaction receipt with payment details included.</Text>

                <Text style={styles.subHeader}>Account Management</Text>
                <Text style={styles.question}>How do I reset my password?</Text>
                <Text style={styles.answer}>Click on "Forgot Password" on the login page, enter your registered email, and follow the instructions sent to your inbox.</Text>

                <Text style={styles.question}>Can I delete my account?</Text>
                <Text style={styles.answer}>Yes, users can request account deletion, and all personal data will be permanently removed within 30 days.</Text>

                <Text style={styles.subHeader}>Trainer Policies</Text>
                <Text style={styles.question}>How do I become a verified trainer?</Text>
                <Text style={styles.answer}>Trainers must submit required verification documents during registration. Once verified, they can start accepting bookings.</Text>

                <Text style={styles.question}>What penalties do trainers face for misconduct?</Text>
                <Text style={styles.answer}>Trainers may receive penalty points for: No-show without prior notice: 5 points (Account freeze for 2-3 days) Late arrival: 2 points (Warning, affects rating) Providing false qualifications: 8 points (Account suspension for 1 month)</Text>

                <Text style={styles.subHeader}>User Conduct and Penalty System</Text>
                <Text style={styles.question}>What happens if I engage in an offline transaction?</Text>
                <Text style={styles.answer}>Engaging in transactions outside TrainerHub violates the platform’s policies. Users or trainers found doing so may face penalties, including account suspension.</Text>

                <Text style={styles.question}>How do penalty points work?</Text>
                <Text style={styles.answer}>Each violation adds penalty points. Accumulating too many may lead to account suspension or a permanent ban.</Text>

                <Text style={styles.question}>Can I appeal a ban?</Text>
                <Text style={styles.answer}>Yes. Users can submit an appeal through the app. The support team will review and determine if the ban should be lifted.</Text>

                <Text style={styles.subHeader}>Security and Privacy</Text>
                <Text style={styles.question}>How does TrainerHub protect my personal information?</Text>
                <Text style={styles.answer}>TrainerHub uses encryption and secure data storage to protect user information. Personal contact information remains hidden until a session is booked and confirmed.</Text>

                <Text style={styles.question}>Can I report inappropriate behavior?</Text>
                <Text style={styles.answer}>Yes, you can report any misconduct through the app. The TrainerHub team will investigate and take appropriate action.</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    question: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
    answer: {
        fontSize: 16,
        marginTop: 4,
        marginBottom: 8,
    },
});

export default FAQ;