import React, { useEffect, useState } from 'react';

import { View, Text, ScrollView, TextInput } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';
import api from '../../services/api';

function TeacherList() {

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const [favorites, setFavorites] = useState<number[]>([]);
  const [teachers, setTeachers] = useState([]);
  const [subject, setSubject] = useState('');
  const [weekDay, setWeekDay] = useState('');
  const [time, setTime] = useState('');

  function handleToggleFiltersVisible() {
    setIsFiltersVisible(!isFiltersVisible);
  }

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(response => {

      if(response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
          return teacher.id;
        })

        setFavorites(favoritedTeachersIds);
      }
    })
  }

  async function handleFiltersSubmit() {
    loadFavorites();
    const response = await api.get('/classes', {
      params: {
        subject,
        week_day: weekDay,
        time,
      }
    })

    setTeachers(response.data);
    setIsFiltersVisible(false);
  }

  return (
    <View style={styles.container}>
      <PageHeader
        title="Proffys disponíveis"
        headerRight= {(
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" size={20} color="#fff"></Feather>
          </BorderlessButton>
        )}
      
      >
       {isFiltersVisible && (
          <View style={styles.searchForm}>
          <Text style={styles.label}>Matéria</Text>
          <TextInput 
            style={styles.input}
            value={subject}
            onChangeText={text => setSubject(text)}
            placeholder="Qual a matéria?"
            placeholderTextColor="#c1bccc"
          />

          <View style={styles.inputGroup}>
            <View style={styles.inputBlock}>
              <Text style={styles.label}>Dia da semana</Text>
              <TextInput 
                value={weekDay}
                onChangeText={text => setWeekDay(text)}
                style={styles.input}
                placeholder="Qual o dia?"
                placeholderTextColor="#c1bccc"
              /> 
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.label}>Horário</Text>
              <TextInput
                value={time}
                onChangeText={text => setTime(text)}
                style={styles.input}
                placeholder="Qual horário?"
                placeholderTextColor="#c1bccc"
              /> 
            </View>
          </View>

          <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Filtrar</Text>
          </RectButton>

        </View>
       )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        {teachers.map((teacher:Teacher) => {
          return <TeacherItem
                    key={teacher.id}
                    teacher={teacher}
                    favorited={favorites.includes(teacher.id)}
                  /> 
        })}
        
      </ScrollView>
    </View>
  )
}

export default TeacherList