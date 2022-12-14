import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { CustomButton, CustomContainer, CustomInput } from "../../components";
import { toast } from "../../components/CustomToast/event/toast.event";
import { resetLoading, setLoading } from "../../redux/states/loader.state";
import { CreateTaskHook } from "./hooks/CreateTask.hook";
import { UpdateTaskHook } from "./hooks/UpdateTask.hook";
import { Feather } from '@expo/vector-icons'; 
import { colors } from "../../styles";
import { DeleteTaskHook } from "./hooks/DeleteTask.hook";

export interface TaskInterface {}

const Task: React.FC<TaskInterface> = () => {
  const dispatch = useDispatch();
  const params: any = useRoute().params;
  const navigation: any = useNavigation();
  const [view, setView] = useState(false);
  const [task, setTask] = useState<{name: string, description: string}>({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (params) {
      setTask({
        name: params.name,
        description: params.description,
      });
    }
    setTimeout(() => {
      setView(true);
    }, 200);
  }, []);

  const handleTaskCreation = async () => {
    Keyboard.dismiss();
    dispatch(setLoading({loading: true}));
    let response = await CreateTaskHook(task);
    if (!response) { dispatch(resetLoading()); return; }
    if (response) {
      if (response.message === 'Task created') {
        toast.success({message: 'Task created', duration: 2000});
        setTimeout(() => {
          navigation.goBack();
          dispatch(resetLoading());
        }, 2000);
      }
    };
  }

  const handleTaskUpdate = async () => {
    Keyboard.dismiss();
    dispatch(setLoading({loading: true}));
    let response = await UpdateTaskHook(params._id, task);
    if (!response) { dispatch(resetLoading()); return; }
    if (response) {
      if (response.message === 'Task updated') {
        toast.success({message: 'Task updated', duration: 2000});
        setTimeout(() => {
          navigation.goBack();
          dispatch(resetLoading());
        }, 2000);
      }
    }
  }

  const handleTaskDelete = async () => {
    Keyboard.dismiss();
    dispatch(setLoading({loading: true}));
    let response = await DeleteTaskHook(params._id);
    if (!response) { dispatch(resetLoading()); return; }
    if (response) {
      if (response.message === 'Task deleted') {
        toast.success({message: 'Task deleted', duration: 2000});
        setTimeout(() => {
          navigation.goBack();
          dispatch(resetLoading());
        }, 2000);
      }
    }
  }

  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      style={{ width: "100%", height: "100%" }}
      activeOpacity={1}
    >
      <CustomContainer>
        {view ? (
          <>
            <CustomInput
              containerStyles={styles.containerStyles}
              inputStyles={styles.titleStyles}
              placeholder="Write a title"
              delay={150}
              value={task.name}
              onChangeText={(text: string) => {
                setTask({
                  ...task,
                  name: text,
                });
              }}
            />
            <CustomInput
              containerStyles={styles.containerStyles}
              inputStyles={styles.descriptionStyles}
              placeholder="Write a description"
              delay={150}
              value={task.description}
              onChangeText={(text: string) => {
                setTask({
                  ...task,
                  description: text,
                });
              }}
            />
          </>
        ) : null}
        {
          params && Platform.OS === "android" ? (
            <TouchableOpacity
              style={{position: 'absolute', top: 50, right: 20}}
              onPress={handleTaskDelete}
            >
              <Feather name="trash-2" size={25} color={colors.error} />
            </TouchableOpacity>
          ): null
        }
        <View style={styles.buttonContainer}>
          <CustomButton
            onPress={() => navigation.goBack()}
            placeholder="Cancel"
            buttonStyles={{ marginRight: 10 }}
          />
          <CustomButton
            onPress={() => {params? handleTaskUpdate() : handleTaskCreation()}}
            placeholder={params ? "Update task" : "Add task"}
            buttonStyles={{ marginLeft: 10 }}
          />
        </View>
      </CustomContainer>
    </TouchableOpacity>
  );
};

export default Task;

const styles = StyleSheet.create({
  containerStyles: {
    marginVertical: 10,
  },
  titleStyles: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionStyles: {
    fontSize: 15,
    fontWeight: "400",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }
});
