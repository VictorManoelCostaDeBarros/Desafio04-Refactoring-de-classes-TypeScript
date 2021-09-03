import { useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useEffect } from 'react';
import { Food as FoodType } from '../../types';
import { AxiosResponse } from 'axios';

function Dashboard() {
  const [foods, setFoods] = useState<FoodType[]>([])
  const [editingFood, setEditingFood] = useState<FoodType>()
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect( () => {
    const arrFood = async (): Promise<void> => {
      await api.get('/foods')
      .then((response: AxiosResponse) => {
        setFoods(response.data)
      })
    }
    arrFood()
  },[])

  async function handleAddFood(food: FoodType) {
    const arrayFoods = [...foods]

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([ ...arrayFoods, response.data ]);
    } catch(err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodType) {
    const arrFoods = [...foods]
    const newEditingFood = {...editingFood}

    try {
      const foodUpdated = await api.put(
        `/foods/${newEditingFood.id}`,
        { ...newEditingFood, ...food },
      );

      const foodsUpdated = arrFoods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    const arrayfoods = [...foods]

    await api.delete(`/foods/${id}`);

    const foodsFiltered = arrayfoods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal () {
    setModalOpen(!modalOpen)
  }

  function toggleEditModal () {
    setEditModalOpen(!editModalOpen)
  }

  function handleEditFood(food: FoodType) {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood!}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
