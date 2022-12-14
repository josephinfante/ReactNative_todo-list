import { StackActions, useNavigation } from "@react-navigation/native";
import { View } from "native-base";
import React, { useEffect, useState } from "react";
import { Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import {
  CustomButton,
  CustomContainer,
  CustomInput,
} from "../../../components";
import { toast } from "../../../components/CustomToast/event/toast.event";
import { resetLoading, setLoading } from "../../../redux/states/loader.state";
import { containerStyles } from "../../../styles";
import { SignUpHook } from "./hooks/SignUp.hook";

export interface SignUpInterface {}

const SignUp: React.FC<SignUpInterface> = () => {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const [signUp, setSignUp] = useState<{
    name: string;
    lastname: string;
    email: string;
    password: string;
  }>({
    name: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [view, setView] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setView(true);
    }, 200);
  }, []);

  const handleSignUp = async () => {
    Keyboard.dismiss();
    dispatch(setLoading({loading: true}));
    let response = await SignUpHook(signUp);
    if (!response) { dispatch(resetLoading()); return; }
    if (response) {
      toast.success({message: `Welcome, ${signUp.name}!`, duration: 2000})
      setTimeout(() => {
        navigation.dispatch(StackActions.popToTop());
        dispatch(resetLoading());
      }, 2500);
    }
  };
  return (
    <TouchableOpacity
      onPress={Keyboard.dismiss}
      activeOpacity={1}
      style={{ width: "100%", height: "100%" }}
    >
      <CustomContainer>
        <View style={containerStyles.container}>
          {view ? (
            <>
              <CustomInput
                containerStyles={styles.containerStyles}
                inputStyles={styles.placeholderStyles}
                placeholder="Firstname"
                delay={120}
                onChangeText={(text: string) => {
                  setSignUp({
                    ...signUp,
                    name: text,
                  });
                }}
              />
              <CustomInput
                containerStyles={styles.containerStyles}
                inputStyles={styles.placeholderStyles}
                placeholder="Lastname"
                delay={170}
                onChangeText={(text: string) => {
                  setSignUp({
                    ...signUp,
                    lastname: text,
                  });
                }}
              />
              <CustomInput
                containerStyles={styles.containerStyles}
                inputStyles={styles.placeholderStyles}
                placeholder="Email"
                delay={220}
                onChangeText={(text: string) => {
                  setSignUp({
                    ...signUp,
                    email: text,
                  });
                }}
              />
              <CustomInput
                containerStyles={styles.containerStyles}
                inputStyles={styles.placeholderStyles}
                placeholder="Password"
                delay={270}
                onChangeText={(text: string) => {
                  setSignUp({
                    ...signUp,
                    password: text,
                  });
                }}
              />
            </>
          ) : null}
          <CustomButton
            placeholder="Sign Up"
            onPress={() => handleSignUp()}
            buttonStyles={styles.buttonContainer}
          />
        </View>
        <CustomButton
          placeholder="Back"
          onPress={() => navigation.goBack()}
          buttonStyles={{ position: "absolute", bottom: 30, right: 20 }}
        />
      </CustomContainer>
    </TouchableOpacity>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  containerStyles: {
    marginVertical: 10,
  },
  placeholderStyles: {
    fontSize: 20,
  },
  buttonContainer: {
    marginVertical: 15,
  },
});
