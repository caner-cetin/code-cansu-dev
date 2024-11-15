"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(
	key: string,
	initialValue: T,
): [T, (value: T) => T] {
	const [storedValue, setStoredValue] = useState<T>(initialValue);

	useEffect(() => {
		try {
			const item = window.localStorage.getItem(key);
			if (item !== null) {
				setStoredValue(JSON.parse(item));
			}
		} catch (error) {
			console.log(error);
		}
	}, [key]);

	const setValue = (value: T) => {
		try {
			setStoredValue(value);
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.log(error);
		}
		return value;
	};

	return [storedValue, setValue];
}