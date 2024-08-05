import { useState, useCallback } from "react";
import { ViewState, EditingState, ChangeSet } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  WeekView,
  MonthView,
  DayView,
  EditRecurrenceMenu,
  AllDayPanel,
  ConfirmationDialog,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  TodayButton,
  DragDropProvider,
  CurrentTimeIndicator,
} from "@devexpress/dx-react-scheduler-material-ui";
import { useAppointments } from "../hooks/useAppointments";
import { useNotification } from "../hooks/useNotification";
import { AppointmentModel } from "@devexpress/dx-react-scheduler";
import { SCHEDULER_CONFIG, VIEWS, LOCALE, FIRST_DAY_OF_WEEK, MESSAGES, VIEW_NAMES } from "../constants";

const SchedulerComponent = () => {
  const [currentViewName, setCurrentViewName] = useState<string>(VIEWS.WEEK);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [addedAppointment, setAddedAppointment] = useState<Partial<AppointmentModel>>({});
  const [appointmentChanges, setAppointmentChanges] = useState<Partial<AppointmentModel>>({});
  const [editingAppointment, setEditingAppointment] = useState<AppointmentModel | undefined>(undefined);

  const { data: appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const { showNotification } = useNotification();

  const commitChanges = useCallback(
    async ({ added, changed, deleted }: ChangeSet) => {
      try {
        if (added) {
          await addAppointment(added);
          showNotification("Appointment added successfully", "success");
        }
        if (changed) {
          const id = Object.keys(changed)[0];
          await updateAppointment({ id, changes: changed[id] });
          showNotification("Appointment updated successfully", "success");
        }
        if (deleted !== undefined) {
          await deleteAppointment(deleted as string);
          showNotification("Appointment deleted successfully", "success");
        }
      } catch (error) {
        showNotification("An error occurred", "error");
      }
    },
    [addAppointment, updateAppointment, deleteAppointment, showNotification]
  );

  return (
    <Scheduler data={appointments} locale={LOCALE} firstDayOfWeek={FIRST_DAY_OF_WEEK}>
      <ViewState currentDate={currentDate} onCurrentDateChange={setCurrentDate} currentViewName={currentViewName} onCurrentViewNameChange={setCurrentViewName} />
      <EditingState
        onCommitChanges={commitChanges}
        addedAppointment={addedAppointment}
        onAddedAppointmentChange={setAddedAppointment}
        appointmentChanges={appointmentChanges}
        onAppointmentChangesChange={setAppointmentChanges}
        editingAppointment={editingAppointment}
        onEditingAppointmentChange={(appointment) => setEditingAppointment(appointment as AppointmentModel)}
      />
      <DayView startDayHour={SCHEDULER_CONFIG.START_DAY_HOUR} endDayHour={SCHEDULER_CONFIG.END_DAY_HOUR} displayName={VIEW_NAMES.DAY} />
      <WeekView startDayHour={SCHEDULER_CONFIG.START_DAY_HOUR} endDayHour={SCHEDULER_CONFIG.END_DAY_HOUR} displayName={VIEW_NAMES.WEEK} />
      <MonthView displayName={VIEW_NAMES.MONTH} />

      <AllDayPanel messages={{ allDay: MESSAGES.ALL_DAY }} />
      <EditRecurrenceMenu />
      <ConfirmationDialog />

      <Toolbar />
      <DateNavigator />
      <TodayButton messages={{ today: MESSAGES.TODAY }} />
      <ViewSwitcher />

      <Appointments />
      <AppointmentTooltip showOpenButton showDeleteButton />
      <AppointmentForm />
      <DragDropProvider />

      <CurrentTimeIndicator shadePreviousCells={true} shadePreviousAppointments={true} updateInterval={1000} />
    </Scheduler>
  );
};

export default SchedulerComponent;
