import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, Timestamp, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { AppointmentModel } from "@devexpress/dx-react-scheduler";

interface FirestoreAppointment extends Omit<AppointmentModel, "startDate" | "endDate"> {
  startDate: Timestamp;
  endDate: Timestamp;
  exDate?: string;
}

const appointmentsCollection = collection(db, "appointments");

const fetchAppointments = async (): Promise<AppointmentModel[]> => {
  const appointmentsQuery = query(appointmentsCollection);
  const snapshot = await getDocs(appointmentsQuery);
  return snapshot.docs
    .map((doc) => {
      const data = doc.data() as FirestoreAppointment;
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
      };
    })
    .filter((appointment) => {
      if (appointment.exDate) {
        const exDates = appointment.exDate.split(",");
        return !exDates.includes(appointment.startDate.toISOString());
      }
      return true;
    });
};

export const useAppointments = () => {
  const queryClient = useQueryClient();

  const { data = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });

  const addAppointment = useMutation({
    mutationFn: async (newAppointment: Partial<AppointmentModel>) => {
      const docRef = await addDoc(appointmentsCollection, {
        ...newAppointment,
        startDate: Timestamp.fromDate(newAppointment.startDate as Date),
        endDate: Timestamp.fromDate(newAppointment.endDate as Date),
      });
      return docRef;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  const updateAppointment = useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: Partial<AppointmentModel> }) => {
      const updateData: Partial<FirestoreAppointment> = {};
      if (changes.title !== undefined) updateData.title = changes.title;
      if (changes.startDate !== undefined) updateData.startDate = Timestamp.fromDate(changes.startDate as Date);
      if (changes.endDate !== undefined) updateData.endDate = Timestamp.fromDate(changes.endDate as Date);
      if (changes.allDay !== undefined) updateData.allDay = changes.allDay;
      if (changes.rRule !== undefined) updateData.rRule = changes.rRule;
      if (changes.notes !== undefined) updateData.notes = changes.notes;
      if (changes.exDate !== undefined) {
        const appointmentDoc = doc(appointmentsCollection, id);
        const appointmentSnapshot = await getDoc(appointmentDoc);
        const appointmentData = appointmentSnapshot.data() as FirestoreAppointment | undefined;
        const currentExDate = appointmentData?.exDate || "";
        updateData.exDate = currentExDate ? `${currentExDate},${changes.exDate}` : changes.exDate;
      }

      await updateDoc(doc(db, "appointments", id), updateData);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  const deleteAppointment = useMutation({
    mutationFn: (id: string) => deleteDoc(doc(db, "appointments", id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  return {
    data,
    addAppointment: addAppointment.mutateAsync,
    updateAppointment: updateAppointment.mutateAsync,
    deleteAppointment: deleteAppointment.mutateAsync,
  };
};
