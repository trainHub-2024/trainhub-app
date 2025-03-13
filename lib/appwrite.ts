import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  OAuthProvider,
  Query,
  Storage,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { UserRoleType } from "@/types";
import { addDays, endOfDay, startOfDay } from "date-fns";
import { parseStringify } from "./utils";
import { Appointment, Sport } from "@/types/appwrite.types";

export const config = {
  platform: "com.trainhub",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID,
  userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
  userProfileCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_USERS_PROFILE_COLLECTION_ID,
  trainerProfileCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_TRAINERS_PROFILE_COLLECTION_ID,
  appointmentCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_APPOINTMENT_COLLECTION_ID,
  ratingCollectionId: process.env.EXPO_PUBLIC_APPWRITE_RATING_COLLECTION_ID,
  adminRequestCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_ADMIN_REQUEST_COLLECTION_ID,
  inboxCollectionId: process.env.EXPO_PUBLIC_APPWRITE_INBOX_COLLECTION_ID,
  messageCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MESSAGE_COLLECTION_ID,
  sportCollectionId: process.env.EXPO_PUBLIC_APPWRITE_SPORT_COLLECTION_ID,
  // notificationsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success")
      throw new Error("Create OAuth2 token failed");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Failed to create session");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const accountData = await account.get();

    if (!accountData?.email) return null;

    const userList = await databases.listDocuments(
      config.databaseId!!,
      config.userCollectionId!!,
      [Query.equal("email", accountData.email)]
    );

    if (userList.documents.length === 0) {
      throw new Error("User document not found.");
    }

    const userDocument = userList.documents[0]; // First matching user document
    const userAvatar = avatar.getInitials(accountData.name);

    return {
      ...accountData,
      name: userDocument?.username,
      avatar: userDocument?.avatar
        ? userDocument.avatar
        : userAvatar.toString(),
      isOnboarded: userDocument.isOnboarded ?? false,
      role: userDocument.role,
      user_id: userDocument.$id,
      profile_id: userDocument?.userProfile_id
        ? userDocument.userProfile_id
        : userDocument?.trainerProfile_id
        ? userDocument?.trainerProfile_id
        : null,
      profile: userDocument?.userProfile_id
        ? userDocument.userProfile_id
        : userDocument?.trainerProfile_id
        ? userDocument?.trainerProfile_id
        : null,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getTrainerProfile({ user_id }: { user_id: string }) {
  try {
    const user = await databases.getDocument(
      config.databaseId!,
      config.userCollectionId!,
      user_id
    );

    if (user.role !== "trainer") {
      throw new Error("User is not a trainer!");
    }

    const profile = await databases.getDocument(
      config.databaseId!,
      config.trainerProfileCollectionId!,
      user.trainerProfile_id.$id
    );

    return profile;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createUser({
  email,
  username,
  password,
  role,
  contactNumber,
}: CreateUserProps) {
  try {
    const accountId = ID.unique();
    const newAccount = await account.create(
      accountId,
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn({ email, password });

    const newUser = await databases.createDocument(
      config.databaseId!,
      config.userCollectionId!,
      ID.unique(),
      {
        username: username,
        email: email,
        avatar: avatarUrl,
        account_id: accountId,
        role,
      }
    );

    // Update the user's phone number
    await account.updatePhone(contactNumber, password);

    // Send phone verification code
    const result = await account.createPhoneVerification();

    return newUser;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function verifyPhone(code: string) {
  const user = await account.get();

  if (!user) {
    console.log("error");
    return;
  }

  await account.updatePhoneVerification(user?.$id, code);
  return "Success";
}

export async function signIn({ email, password }: SignInProps) {
  try {
    //TODO: add verification
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function onBoardTrainee({
  contactNumber,
  gender,
  location,
  dob,
  id,
}: onBoardTraineeProps) {
  try {
    const user = await getCurrentUser();

    const newProfile = await databases.createDocument(
      config.databaseId!,
      config.userProfileCollectionId!,
      ID.unique(),
      {
        contactNumber: user?.phone,
        gender,
        location,
        dob,
        name: user?.name,
        user_id: user?.user_id,
      }
    );

    await databases.updateDocument(
      config.databaseId!,
      config.userCollectionId!,
      id,
      {
        isOnboarded: true,
        userProfile_id: newProfile.$id,
      }
    );

    return newProfile;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function onBoardTrainer({
  contactNumber,
  gender,
  location,
  dob,
  id,
}: onBoardTrainerProps) {
  try {
    const user = await getCurrentUser();

    const newProfile = await databases.createDocument(
      config.databaseId!,
      config.trainerProfileCollectionId!,
      ID.unique(),
      {
        contactNumber,
        gender,
        location,
        dob,
        name: user?.name,
        user_id: user?.user_id,
        score: 0,
      }
    );

    await databases.updateDocument(
      config.databaseId!,
      config.userCollectionId!,
      id,
      {
        trainerProfile_id: newProfile.$id,
      }
    );

    return newProfile;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateScheduleTrainer({
  trainingPrice,
  startTime,
  endTime,
  workDays,
  id,

  qrCodePayment,
  sports_id,
}: updateScheduleTrainerProps) {
  try {
    console.log("USER: ", id);
    console.log({
      startTime,
      endTime,
      workDays,
      id,
    });
    const user = await databases.getDocument(
      config.databaseId!,
      config.userCollectionId!,
      id
    );

    if (!user || !user.trainerProfile_id) {
      throw new Error("User not found!");
    }

    let body: any = {
      trainingPrice: isNaN(Number(trainingPrice)) ? 1 : Number(trainingPrice),
      startTime,
      endTime,
      workDays,
      sports_id,
    };

    if (qrCodePayment) {
      console.log(qrCodePayment);
      const qrCodePaymentURL = await uploadFile(qrCodePayment);
      body = {
        ...body,
        qrCodePayment: qrCodePaymentURL,
      };
    }

    const updatedProfile = await databases.updateDocument(
      config.databaseId!,
      config.trainerProfileCollectionId!,
      user.trainerProfile_id.$id,
      body
    );

    await databases.updateDocument(
      config.databaseId!,
      config.userCollectionId!,
      id,
      {
        isOnboarded: true,
      }
    );

    return updatedProfile;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getTrainers({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    console.log("fetch trainers...");
    const buildQuery = [
      Query.orderDesc("score"),
      Query.equal("isDisabled", false),
    ];

    if (query) buildQuery.push(Query.contains("name", query));

    if (filter) buildQuery.push(Query.contains("sports_id", filter));

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.trainerProfileCollectionId!,
      buildQuery
    );

    const trainersWithSports = await Promise.all(
      result.documents.map(async (trainer) => {
        if (!trainer.sports_id || trainer.sports_id.length === 0) {
          return { ...parseStringify(trainer), sports: [] }; // No sports
        }

        // Fetch all sports details
        const sports = await Promise.all(
          trainer.sports_id.map(async (sportId: string) => {
            return await getSportById({ id: sportId });
          })
        );

        return {
          ...parseStringify(trainer),
          sports: sports.filter(Boolean), // Remove null values
        };
      })
    );

    return trainersWithSports || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getSportById({
  id,
}: {
  id: string;
}): Promise<Sport | null> {
  try {
    const data = await databases.getDocument(
      config.databaseId!,
      config.sportCollectionId!,
      id
    );

    return parseStringify(data);
  } catch (error) {
    const errorMessage =
      "An error occurred while retrieving the sport details:";
    console.error(errorMessage, error);
    return null;
  }
}

export async function getTrainerById({ id }: { id: string }) {
  try {
    const result = await databases.getDocument(
      config.databaseId!,
      config.userCollectionId!,
      id
    );

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserById({ id }: { id: string }) {
  try {
    const result = await databases.getDocument(
      config.databaseId!,
      config.userCollectionId!,
      id
    );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createAppointment({
  date,
  price,
  notes,
  user_id,
  trainer_id,
  timeSlot,
}: CreateAppointmentProps) {
  try {
    // Fetch trainer and current user
    const trainer = await getUserById({ id: trainer_id });
    const currentUser = await getUserById({ id: user_id });

    if (!trainer?.trainerProfile_id || !currentUser?.userProfile_id) {
      throw new Error("No trainer or user found");
    }

    // Ensure date is stored as ISO string
    // const appointmentDate = new Date(date)
    const body = {
      date,
      price: trainer?.trainerProfile_id.trainingPrice,
      notes: "",
      trainerProfile_id: trainer?.trainerProfile_id.$id,
      userProfile_id: currentUser?.userProfile_id.$id,
      timeSlot,
    };

    console.log("BOOKING....");
    console.log(body);
    console.log("BOOOKING--------------------------------");

    console.log(currentUser.userProfile_id);

    // Create new appointment
    const newAppointment = await databases.createDocument(
      config.databaseId!,
      config.appointmentCollectionId!,
      ID.unique(),
      body
    );

    // Add appointment to Trainer's profile
    await databases.updateDocument(
      config.databaseId!,
      config.trainerProfileCollectionId!,
      trainer.trainerProfile_id.$id,
      {
        appointments: [
          ...(trainer.trainerProfile_id.appointments || []),
          newAppointment.$id,
        ],
      }
    );

    // Add appointment to Trainee's profile
    await databases.updateDocument(
      config.databaseId!,
      config.userProfileCollectionId!,
      currentUser.userProfile_id.$id,
      {
        appointments: [
          ...(currentUser.userProfile_id.appointments || []),
          newAppointment.$id,
        ],
      }
    );

    return newAppointment;
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    throw new Error(error.message || "Failed to create appointment");
  }
}

export async function getUserAppointments({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    console.log("fetch my appointments...");
    const user = await getCurrentUser();

    if (!user?.profile_id) {
      throw new Error("Profile not found");
    }

    const buildQuery = [
      Query.orderDesc("date"),
      Query.or([
        Query.equal("userProfile_id", user.profile_id.$id),
        Query.equal("trainerProfile_id", user.profile_id.$id),
      ]),
    ];

    if (filter) {
      buildQuery.push(Query.equal("status", filter));
    }

    // if (query) buildQuery.push(Query.startsWith("username", query));

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.appointmentCollectionId!,
      buildQuery
    );

    return result.documents || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUserUpcomingAppointments({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    console.log("fetch upcoming appointments...");
    const user = await getCurrentUser();

    if (!user?.profile_id) {
      throw new Error("Profile not found");
    }

    const dateToday = startOfDay(new Date());

    const buildQuery: any[] = [
      Query.orderAsc("date"),
      Query.or([
        Query.equal("userProfile_id", user.profile_id.$id),
        Query.equal("trainerProfile_id", user.profile_id.$id),
      ]),
      Query.and([
        Query.notEqual("status", "completed"),
        Query.notEqual("status", "cancelled"),
      ]),
      // Query.greaterThanEqual("date", dateToday.toISOString()),
    ];

    if (filter)
      buildQuery.push(
        Query.and([
          Query.greaterThanEqual(
            "date",
            startOfDay(new Date(filter)).toISOString()
          ),
          Query.lessThanEqual("date", endOfDay(new Date(filter)).toISOString()),
        ])
      );

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.appointmentCollectionId!,
      buildQuery
    );

    return result.documents || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUserCompletedAppointments({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    console.log("fetch completed appointments...");
    const user = await getCurrentUser();

    if (!user?.profile_id) {
      throw new Error("Profile not found");
    }

    const buildQuery: any[] = [
      Query.orderDesc("date"),
      Query.or([
        Query.equal("userProfile_id", user.profile_id.$id),
        Query.equal("trainerProfile_id", user.profile_id.$id),
      ]),
      Query.equal("status", "completed"),
    ];

    if (filter)
      buildQuery.push(
        Query.and([
          Query.greaterThanEqual(
            "date",
            startOfDay(new Date(filter)).toISOString()
          ),
          Query.lessThanEqual("date", endOfDay(new Date(filter)).toISOString()),
        ])
      );

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.appointmentCollectionId!,
      buildQuery
    );

    return result.documents || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getAppointmentById({
  id,
}: {
  id: string;
}): Promise<Appointment | any> {
  try {
    const result = await databases.getDocument(
      config.databaseId!,
      config.appointmentCollectionId!,
      id
    );

    if (!result) {
      throw new Error("Appointment not found!");
    }

    let sports = [];

    if (
      result?.trainerProfile?.sports_id &&
      result?.trainerProfile?.sports_id.length > 0
    ) {
      const sport = await getSportById({
        id: result?.trainerProfile?.sports_id[0],
      });

      if (sport) {
        sports.push(sport);
      }
    }

    const avatarTrainer = await getTrainerById({
      id: result?.trainerProfile?.user_id,
    });
    const avatarUser = await getUserById({ id: result?.userProfile?.user_id });

    return {
      ...result,
      sports,
      trainerProfile: avatarTrainer,
      userProfile: avatarUser,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateStatusAppointmentById({
  id,
  status,
  location,
  duration,
}: {
  id: string;
  status: string;
  location?: string;
  duration?: number;
}) {
  try {
    if (status === "completed" && (duration ?? 0) > 0 && duration) {
      return completeAppointmentById({ id, duration });
    } else if (status === "cancelled") {
      return cancelAppointmentById({ id });
    } else if (status === "confirmed" && location) {
      const result = await databases.updateDocument(
        config.databaseId!,
        config.appointmentCollectionId!,
        id,
        {
          status,
          venue: location,
        }
      );
      return result;
    } else {
      const result = await databases.updateDocument(
        config.databaseId!,
        config.appointmentCollectionId!,
        id,
        {
          status,
        }
      );
      return result;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function completeAppointmentById({
  id,
  duration,
}: {
  id: string;
  duration: number;
}) {
  try {
    // Get the current logged-in user (trainer)
    const currentUser = await getCurrentUser();
    console.log(currentUser);

    // Ensure the current user is a trainer
    if (currentUser?.role !== "trainer") {
      throw new Error("Only trainers can complete appointments");
    }

    // Update the appointment status to "completed"
    const updatedAppointment = await databases.updateDocument(
      config.databaseId!,
      config.appointmentCollectionId!,
      id,
      {
        status: "completed",
        duration: Math.floor(duration),
      }
    );

    // Increment the trainer's score
    const trainerProfile = await databases.getDocument(
      config.databaseId!,
      config.trainerProfileCollectionId!,
      currentUser.profile_id.$id
    );

    if (!trainerProfile || typeof trainerProfile.score !== "number") {
      throw new Error("Trainer profile not found or score is missing");
    }

    // Increment score by 1
    const updatedProfile = await databases.updateDocument(
      config.databaseId!,
      config.trainerProfileCollectionId!,
      trainerProfile.$id,
      {
        score: trainerProfile.score + 1, // Increment score by 1
      }
    );

    // Return the updated appointment and trainer profile (optional)
    return { updatedAppointment, updatedProfile };
  } catch (error) {
    console.error("Error completing appointment:", error);
    // Rethrow the error to be handled by the caller
    throw new Error("Failed to complete the appointment");
  }
}

async function cancelAppointmentById({ id }: { id: string }) {
  try {
    // Get the current logged-in user (trainer)
    const currentUser = await getCurrentUser();
    console.log(currentUser);

    // Ensure the current user is a trainer
    if (!currentUser) {
      throw new Error("User not found!");
    }

    // Update the appointment status to "cancelled"
    const updatedAppointment = await databases.updateDocument(
      config.databaseId!,
      config.appointmentCollectionId!,
      id,
      {
        status: "cancelled",
        isPenalized: currentUser?.role === "trainer" ? true : false,
      }
    );

    if (currentUser?.role === "trainee") {
      return { updatedAppointment };
    }
    const trainerProfile = await databases.getDocument(
      config.databaseId!,
      config.trainerProfileCollectionId!,
      currentUser.profile_id.$id
    );

    if (!trainerProfile || typeof trainerProfile.score !== "number") {
      throw new Error("Trainer profile not found or score is missing");
    }

    const newScore =
      trainerProfile.score - 1 < 0 ? 0 : trainerProfile.score - 1;
    const updatedProfile = await databases.updateDocument(
      config.databaseId!,
      config.trainerProfileCollectionId!,
      trainerProfile.$id,
      {
        score: newScore, // Decrement score by 1
      }
    );

    return { updatedAppointment, updatedProfile };
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    // Rethrow the error to be handled by the caller
    throw new Error("Failed to cancel the appointment");
  }
}

export async function createRating({
  rating,
  trainerId,
  userId,
  appointmentId,
}: CreateRatingProps) {
  try {
    console.log("Trying to rate...");
    const newRating = await databases.createDocument(
      config.databaseId!,
      config.ratingCollectionId!,
      ID.unique(),
      {
        rating,
        trainer_id: trainerId,
        user_id: userId,
        appointment_id: appointmentId,
      }
    );

    const trainerProfile = await databases.getDocument(
      config.databaseId!,
      config.trainerProfileCollectionId!,
      trainerId
    );

    const userProfile = await databases.getDocument(
      config.databaseId!,
      config.userProfileCollectionId!,
      userId
    );

    // add rating to trainer
    await databases.updateDocument(
      config.databaseId!,
      config.trainerProfileCollectionId!,
      trainerId,
      {
        ratings: [...(trainerProfile.ratings || []), newRating.$id],
      }
    );

    await databases.updateDocument(
      config.databaseId!,
      config.userProfileCollectionId!,
      userId,
      {
        ratings: [...(userProfile.ratings || []), newRating.$id],
      }
    );

    await databases.updateDocument(
      config.databaseId!,
      config.appointmentCollectionId!,
      appointmentId,
      {
        rating: newRating.$id,
      }
    );

    return newRating;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateUserProfile({
  profileId,
  body: form,
  role,
}: {
  profileId: string;
  body: {
    name: string;
    contactNumber: string;
    gender: string;
    location: string;
    image: any;
    password: string;

    trainingPrice?: number;
    startTime?: Date;
    endTime?: Date;
    workDays: string[];
    qrCodePayment?: any;
    sports_id: string[];
  };
  role?: "trainer" | "trainee";
}) {
  try {
    console.log("UPDATING PROFILE...");
    let body: any = {};
    // Check if password is null or an empty string and remove it from the body if so
    if (form.password === null || form.password === "") {
      body = {
        name: form.name,
        location: form.location,
        gender: form.gender,
        contactNumber: form.contactNumber,
      };
    } else {
      body = {
        ...form,
      };
    }

    if (role === "trainer") {
      body = {
        ...body,
        trainingPrice: form.trainingPrice,
        startTime: form.startTime,
        endTime: form.endTime,
        workDays: form.workDays,
        sports_id: form.sports_id,
      };

      if (form.qrCodePayment) {
        const qrCodePaymentURL = await uploadFile(form.qrCodePayment);
        body = {
          ...body,
          qrCodePayment: qrCodePaymentURL,
        };
      }
    }

    // Update the user profile without the password if it's null or empty
    let updated;
    if (role === "trainee") {
      updated = await databases.updateDocument(
        config.databaseId!,
        config.userProfileCollectionId!,
        profileId,
        body
      );
    } else {
      console.log(body);

      updated = await databases.updateDocument(
        config.databaseId!,
        config.trainerProfileCollectionId!,
        profileId,
        body
      );
    }

    let updatedUserBody: any = { username: form.name };
    if (form.image !== null) {
      console.log(form.image);
      const avatar = await uploadFile(form.image);
      updatedUserBody = {
        ...updatedUserBody,
        avatar,
      };
    }

    await databases.updateDocument(
      config.databaseId!,
      config.userCollectionId!,
      updated.user_id,
      updatedUserBody
    );

    console.log(updated);

    return updated;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function uploadFile(file: any) {
  if (!file) return;

  try {
    console.log("Checking if file is already uploaded...");

    if (!file?.uri) {
      console.log("File already exists in Appwrite. Skipping upload.");
      return file;
    }

    // Skip upload if the file is already hosted on Appwrite
    // if (!file?.uri || file?.includes("https://cloud.appwrite.io/v1/storage/buckets")) {
    //   // Return the existing file URL
    // }

    console.log("UPLOADING FILE", file);

    // Ensure asset has required properties
    const asset = {
      uri: file.uri,
      type: file.mimeType || "image/jpeg",
      name: file.name || `upload_${Date.now()}.jpg`,
      size: file.size || 0, // Ensure size is included
    };

    if (!config.storageId) throw new Error("Storage ID is undefined");

    // Upload file to Appwrite
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    console.log("Uploaded File:", uploadedFile);

    if (!uploadedFile?.$id) {
      throw new Error("File upload failed. No file ID returned.");
    }

    // Generate preview URL for the uploaded file
    const fileUrl = await getFilePreview(uploadedFile.$id);
    return fileUrl;
  } catch (error: any) {
    console.error("Upload Error:", error.message);
    throw new Error(error.message);
  }
}

export async function getFilePreview(fileId: any) {
  let fileUrl;

  try {
    console.log("GENERATING FILE PREVIEW");
    console.log(fileId);
    fileUrl = storage.getFilePreview(config.storageId!, fileId, 2000, 2000);
    console.log(fileUrl);

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function uploadCertificate({
  profileId,
  file,
}: {
  profileId: string;
  file: any;
}) {
  console.log(profileId);

  const certificateUri = await uploadFile(file);

  const profile = await databases.getDocument(
    config.databaseId!,
    config.trainerProfileCollectionId!,
    profileId
  );

  await databases.updateDocument(
    config.databaseId!,
    config.trainerProfileCollectionId!,
    profileId,
    {
      certification: certificateUri,
      isCertified: false,
    }
  );

  await databases.createDocument(
    config.databaseId!,
    config.adminRequestCollectionId!,
    ID.unique(),
    {
      trainerProfile_id: profileId,
      certification: certificateUri,
      type: "certification",
    }
  );
}

export async function createPayment({
  type,
  appointmentId,
  paymentImage,
}: {
  type: "cash" | "online";
  appointmentId: string;
  paymentImage?: any;
}) {
  if (type === "cash") {
    return payUsingCash(appointmentId);
  } else {
    if (paymentImage) {
      return payUsingOnline(appointmentId, paymentImage);
    }
  }
}

export async function payUsingCash(appointmentId: string) {
  const updatedPayment = await databases.updateDocument(
    config.databaseId!,
    config.appointmentCollectionId!,
    appointmentId,
    {
      paymentMethod: "cash",
      paymentDate: new Date(),
    }
  );

  return updatedPayment;
}

export async function payUsingOnline(
  appointmentId: string,
  paymentImageSource: string
) {
  const paymentImage = await uploadFile(paymentImageSource);

  const updatedPayment = await databases.updateDocument(
    config.databaseId!,
    config.appointmentCollectionId!,
    appointmentId,
    {
      paymentMethod: "online",
      paymentDate: new Date(),
      paymentImage,
    }
  );

  return updatedPayment;
}

export async function confirmPayment(appointmentId: string) {
  const updatedPayment = await databases.updateDocument(
    config.databaseId!,
    config.appointmentCollectionId!,
    appointmentId,
    {
      isConfirmedPayment: true,
    }
  );

  return updatedPayment;
}

export async function getTomorrowAppointments({ limit }: { limit?: number }) {
  try {
    console.log("fetch tomorrow appointments...");
    const user = await getCurrentUser();

    if (!user?.profile_id) {
      throw new Error("Profile not found");
    }

    const buildQuery: any[] = [
      Query.orderDesc("date"),
      Query.equal("status", "confirmed"),
      Query.equal("userProfile_id", user.profile_id.$id),
      Query.and([
        Query.greaterThanEqual(
          "date",
          startOfDay(addDays(new Date(), 1)).toISOString()
        ),
        Query.lessThanEqual(
          "date",
          endOfDay(addDays(new Date(), 1)).toISOString()
        ),
      ]),
    ];

    console.log(buildQuery);

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.appointmentCollectionId!,
      buildQuery
    );

    return result.documents || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPaidAppointments({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    console.log("fetch paid appointments...");
    const user = await getCurrentUser();

    if (!user?.profile_id) {
      throw new Error("Profile not found");
    }

    const buildQuery: any[] = [
      Query.orderDesc("$updatedAt"),
      Query.equal("isConfirmedPayment", true),
      Query.equal("trainerProfile_id", user.profile_id.$id),
    ];

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId!,
      config.appointmentCollectionId!,
      buildQuery
    );

    console.log("PAID APPOINTMENTSSS");
    console.log(result);

    return result.documents || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function creatInbox({
  trainerProfile_id,
  userProfile_id,
}: {
  trainerProfile_id: string;
  userProfile_id: string;
}) {
  try {
    console.log("Creating inbox...");
    const exists = await checkIfInboxExists({
      trainerProfile_id,
      userProfile_id,
    });
    if (exists) {
      console.log("Inbox already exists");
      return exists;
    }

    const newInbox = await databases.createDocument(
      config.databaseId!,
      config.inboxCollectionId!,
      ID.unique(),
      {
        trainerProfile_id,
        userProfile_id,
      }
    );

    return newInbox;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function checkIfInboxExists({
  trainerProfile_id,
  userProfile_id,
}: {
  trainerProfile_id: string;
  userProfile_id: string;
}) {
  const buildQuery: any[] = [
    Query.and([
      Query.equal("trainerProfile_id", trainerProfile_id),
      Query.equal("userProfile_id", userProfile_id),
    ]),
  ];

  const result = await databases.listDocuments(
    config.databaseId!,
    config.inboxCollectionId!,
    buildQuery
  );

  return result?.documents[0] || null;
}

export async function getInbox() {
  try {
    console.log("fetch inbox...");
    const user = await getCurrentUser();

    if (!user?.profile_id) {
      throw new Error("Profile not found");
    }

    const buildQuery: any[] = [
      Query.or([
        Query.equal("trainerProfile_id", user.profile_id.$id),
        Query.equal("userProfile_id", user.profile_id.$id),
      ]),
    ];

    const result = await databases.listDocuments(
      config.databaseId!,
      config.inboxCollectionId!,
      buildQuery
    );

    const inboxWithProfiles = await Promise.all(
      result.documents.map(async (inbox) => {
        const profiles = await getInboxUsers(inbox);
        return { ...inbox, ...profiles };
      })
    );

    return inboxWithProfiles;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getInboxById({ id }: { id: string }) {
  try {
    const inbox = await databases.getDocument(
      config.databaseId!,
      config.inboxCollectionId!,
      id
    );

    const profiles = await getInboxUsers(inbox);

    return { ...inbox, ...profiles };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getInboxMessages({ id }: { id: string }) {
  const buildQuery: any[] = [Query.equal("inbox_id", id)];

  const result = await databases.listDocuments(
    config.databaseId!,
    config.messageCollectionId!,
    buildQuery
  );

  return result?.documents || [];
}

export async function creatInboxMessage({
  inbox_id,
  sender_id,
  message,
}: {
  inbox_id: string;
  sender_id: string;
  message: string;
}) {
  try {
    console.log("Creating inbox message...");

    const newInboxMessage = await databases.createDocument(
      config.databaseId!,
      config.messageCollectionId!,
      ID.unique(),
      {
        inbox_id,
        sender_id,
        text: message,
      }
    );

    await databases.updateDocument(
      config.databaseId!,
      config.inboxCollectionId!,
      inbox_id,
      {
        lastMessage: message,
      }
    );

    return newInboxMessage;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function getInboxUsers(inbox: any) {
  const trainerProfile_id = inbox.trainerProfile_id;
  const userProfile_id = inbox.userProfile_id;

  const trainerProfile = await getProfileById({
    id: trainerProfile_id,
    role: "trainer",
  });
  const userProfile = await getProfileById({
    id: userProfile_id,
    role: "trainee",
  });

  return { trainerProfile, userProfile };
}

async function getProfileById({
  id,
  role,
}: {
  id: string;
  role: "trainer" | "trainee";
}) {
  try {
    const collection =
      role === "trainee"
        ? config.userProfileCollectionId!
        : config.trainerProfileCollectionId!;

    const result = await databases.getDocument(
      config.databaseId!,
      collection,
      id
    );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

type CreateAppointmentProps = {
  user_id: string;
  trainer_id: string;
  date: Date;
  notes?: string;
  price: string;
  timeSlot: string;
};
type CreateUserProps = {
  email: string;
  username: string;
  password: string;
  contactNumber: string;
  role: UserRoleType;
};
type CreateRatingProps = {
  rating: number;
  trainerId: string;
  userId: string;
  appointmentId: string;
};
type onBoardTrainerProps = {
  contactNumber: string;
  gender: string;
  location: string;
  dob: Date;
  id: string;
};
type onBoardTraineeProps = {
  contactNumber: string;
  gender: string;
  location: string;
  dob: Date;
  id: string;
};
type updateScheduleTrainerProps = {
  trainingPrice: string;
  startTime: Date;
  endTime: Date;
  workDays: string[];
  id: string;

  qrCodePayment?: any;
  sports_id: string[];
};
type SignInProps = {
  email: string;
  password: string;
};
