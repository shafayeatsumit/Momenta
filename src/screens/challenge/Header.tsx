import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ImageBackground, View, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { Lesson } from "../../redux/actions/challenge";
import ExerciseTitle from "../../components/ExerciseTitle";
import ExerciseInfo from "../../components/ExerciseInfo";
import BackButton from "../../components/BackButton";

interface Props {
  title: string,
  handleBack: () => void;
  handlePressInfo: () => void;
  opacity: any;
}


const Header = ({ title, handleBack, opacity, handlePressInfo }: Props) => {
  return (
    <>
      <ExerciseTitle title={title} textStyle={{ fontSize: 24 }} opacity={opacity} />
      <BackButton handlePress={handleBack} opacity={opacity} />
      <ExerciseInfo opacity={opacity} handlePress={handlePressInfo} opacity={opacity} />
    </>
  )
}

export default Header;