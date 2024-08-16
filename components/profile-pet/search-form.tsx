"use client";

export default function SearchForm() {
  return (
    <form className="w-full h-full">
      <input
        className="w-full h-full  rounded-md px-5 outline-none transition "
        placeholder="Buscar mascotas..."
        type="search"
      />
    </form>
  );
}
