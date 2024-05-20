"use client";
import React, { useState, useEffect } from "react";
import Select, { MultiValue, components } from "react-select";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import axios from "axios";
import Image from "next/image";

interface Character {
  id: number;
  name: string;
  image: string;
  episode: string[];
}

interface OptionType {
  value: number;
  label: string;
  image: string;
}

interface FormValues {
  selectedOptions: MultiValue<OptionType>;
}

const MultiSelectAutocomplete: React.FC = () => {
  const { control, handleSubmit } = useForm<FormValues>();
  const [options, setOptions] = useState<OptionType[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get(
          "https://rickandmortyapi.com/api/character"
        );
        const characters: Character[] = response.data.results;
        const characterOptions = characters.map((character) => ({
          value: character.id,
          label: character.name,
          image: character.image,
        }));
        setOptions(characterOptions);
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };

    fetchCharacters();
  }, []);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data.selectedOptions);
  };

  // Custom filter option function
  const filterOption = (option: { data: OptionType }, inputValue: string) => {
    return option.data.label.toLowerCase().includes(inputValue.toLowerCase());
  };

  // Custom SingleOption component to highlight matching text
  const CustomOption = (props: any) => {
    const { data, innerRef, innerProps } = props;
    const parts = data.label.split(new RegExp(`(${inputValue})`, "gi"));
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="flex items-center hover:cursor-pointer p-2 hover:bg-gray-200 border-y border-slate-300"
      >
        <Image
          src={data.image}
          alt={data.label}
          width={30}
          height={30}
          className="w-8 h-8 rounded-full mr-2"
        />
        <div>
          {parts.map((part:String, index:number) =>
            part.toLowerCase() === inputValue.toLowerCase() ? (
              <span key={index} className="font-bold text-black">
                {part}
              </span>
            ) : (
              <span key={index}>{part}</span>
            )
          )}
        </div>
      </div>
    );
  };

  const CustomMenu = (props: any) => {
    return (
      <components.Menu {...props}>
        <div className="h-full bg-slate-100 rounded-2xl">{props.children}</div>
      </components.Menu>
    );
  };

  return (
    <main className="h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 mx-auto w-full sm:w-[400px] h-[550px]"
      >
        <Controller
          name="selectedOptions"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Select
              {...field}
              options={options}
              isMulti
              closeMenuOnSelect={false}
              placeholder="Select characters..."
              className="react-select-container"
              classNamePrefix="react-select"
              components={{ Option: CustomOption, Menu: CustomMenu }}
              filterOption={filterOption} // Custom filter function
              menuIsOpen // Force menu to be open
              onInputChange={(value) => setInputValue(value)}
            />
          )}
        />
      </form>
    </main>
  );
};

export default MultiSelectAutocomplete;
