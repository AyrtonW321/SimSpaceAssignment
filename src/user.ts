window.onload = () => {
  const canvas = document.getElementById(
    "gridCanvas"
  ) as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const rows: number = 50;
  const cols: number = 50;
  const cellSize: number = canvas.width / cols;

  ctx.strokeStyle = "#ccc";

  for (let i = 0; i <= cols; i++) {
    const x: number = i * cellSize;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let j = 0; j <= rows; j++) {
    const y: number = j * cellSize;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
};

type FacilityType = 'essential' | 'residential' | 'industrial' | 'commercial' | 'defense';

interface FacilityItem {
  name: string;
  image: string;
}

const facilities: Record<FacilityType, FacilityItem[]> = {
  essential: [
    { name: "Emergency Services", image: "police.png" },
    { name: "Education Centres", image: "school.png" },
    { name: "Medical Centres", image: "hospital.png" },
    { name: "Government", image: "government.png" },
    { name: "Power Plants", image: "powerplant.png" }
  ],
  residential: [
    { name: "Luxury Homes", image: "luxury-homes.png" },
    { name: "Comfortable Homes", image: "comfortable-homes.png" },
    { name: "Affordable Homes", image: "affordable-homes.png" }
  ],
  industrial: [
    { name: "Factories", image: "factories.png" },
    { name: "Warehouses", image: "warehouses.png" },
    { name: "Environmental Facilities", image: "environmental-facilities.png" }
  ],
  commercial: [
    { name: "Stores", image: "stores.png" },
    { name: "Restaurants", image: "restaurants.png" },
    { name: "Offices", image: "offices.png" }
  ],
  defense: [
    { name: "Planetary Defense System", image: "planetary-defense-system.png" }
  ]
};

const typeButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.typeButton');
const selectorButtonContainer = document.querySelector('.selectorButtonContainer') as HTMLDivElement;

// Set dataset for each typeButton
typeButtons.forEach((btn, i) => {
  const types: FacilityType[] = ['essential', 'residential', 'industrial', 'commercial', 'defense'];
  btn.dataset.type = types[i];
});

typeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const type = button.dataset.type as FacilityType;
    typeButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    displayBuildings(type);
  });
});

function displayBuildings(type: FacilityType): void {
  selectorButtonContainer.innerHTML = ''; // Clear existing buttons

  facilities[type].forEach(({ name, image }) => {
    const button = document.createElement('button');
    button.classList.add('selectorButton');

    const img = document.createElement('img');
    img.src = `./Imgs/${type}/${image}`;
    img.alt = name;
    img.title = name;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';

    button.appendChild(img);
    selectorButtonContainer.appendChild(button);
  });
}
