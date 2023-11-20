'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

function index() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-10">
      <h1 className="text-4xl font-bold">Herzlich willkommen!</h1>
      <h2 className="text-2xl mt-6 text-center">Dieser Wizard hilft dir dabei, in nur wenigen Schritten eine <span className="font-semibold">Qualifikationsmatrix</span> für die Mitarbeitenden deines Produktionswerkes zu erstellen.</h2>
      <div className="absolute bottom-0 right-0 m-4">
        <Link href="/home">
          <button className="bg-blue-950 hover:bg-hover-color text-white font-bold py-2 px-4 rounded">
            Start
          </button>
        </Link>
      </div>
    </div>
  );
}

export default index;