// /* eslint-disable max-len */
// function nameGen(type)
// {
//     const tp = type;
//     const nm1 = ["Abyss", "Adventure", "Aftermath", "Ambition", "Angel", "Apparatus", "Arachnid", "Arch", "Balance", "Balloon", "Baron", "Basin", "Loophole", "Expedition", "Battle", "Beast", "Beauty", "Blade", "Bluff", "Bomb", "Bomber", "Boost", "Boulder", "Brass", "Brass Knuckle", "Bridge", "Brutality", "Bullet", "Candle", "Cannon", "Canyon", "Chain", "Chaos", "Chasm", "Chimera", "Cliffhanger", "Comet", "Commando", "Condor", "Cork", "Count", "Courage", "Crook", "Cross", "Crown", "Curse", "Curtain", "Curve", "Daemon", "Death", "Delight", "Demon", "Desire", "Devil", "Diamond", "Dimension", "Diver", "Divide", "Division", "Dread", "Dream", "Dreamscape", "Earthquake", "Enchantment", "Enigma", "Eruption", "Escape", "Eternity", "Eventide", "Evolution", "Explosion", "Extreme", "Fall", "Feather", "Figure", "Fire", "Fireball", "Flake", "Flame", "Flight", "Flock", "Fluke", "Flux", "Fog", "Force", "Fortune", "Freedom", "Garden", "Ghost", "Glass", "Glutton", "Gravity", "Heart", "Heartbeat", "Hook", "Horror", "Hurricane", "Icicle", "Impulse", "Island", "Jewel", "Judgment", "Justice", "Knockout", "Kraken", "Leopard", "Mammoth", "Medium", "Meteor", "Miracle", "Mirror", "Mist", "Motion", "Night", "Nightmare", "Octopus", "Omen", "Operation", "Oracle", "Panther", "Phantom", "Phase", "Prison", "Pulse", "Punishment", "Quake", "Quicksand", "Quill", "Reflection", "Regret", "Requiem", "Response", "Rhythm", "Riddle", "Ride", "River", "Ruin", "Serpent", "Servant", "Shade", "Shadow", "Shift", "Shock", "Signal", "Snake", "Snowflake", "Sparkle", "Spell", "Split", "Star", "Stitch", "Storm", "Switch", "Switcheroo", "Thrill", "Throne", "Thunder", "Tornado", "Tower", "Tremor", "Trick", "Twist", "Twister", "Typhoon", "Vault", "Volcano", "Voyage", "Wave", "Wipeout", "Wonder", "Zephyr"];
//     const nm2 = ["Boat", "Bungee", "Coaster", "Coil", "Depth", "Diver", "Drop", "Edge", "Expedition", "Extreme", "House", "Hall", "Loop", "Manor", "Mansion", "Obelisk", "Palace", "Pass", "Passage", "Pendulum", "Place", "Plummet", "Plunge", "Rapids", "Release", "Ride", "Rider", "Shot", "Slide", "Spire", "Supreme", "Swing", "Tower", "Tumble", "Wheel"];
//     const nm3 = ["Acrobatics", "Action", "Adventure", "Amazement", "Autumn", "Awe", "Balance", "Battle", "Beginnings", "Belief", "Blood", "Bones", "Bravery", "Bubbles", "Candy", "Chains", "Chaos", "Clarity", "Clouds", "Courage", "Creatures", "Cushions", "Dance", "Darkness", "Death", "Delight", "Desire", "Discovery", "Doom", "Dread", "Dreams", "Ecstasy", "Eternity", "Fascination", "Fear", "Feasts", "Fire", "Flame", "Flukes", "Fortune", "Fun", "Ghosts", "Glass", "Gluttony", "Gold", "Harmony", "Hilarity", "Horror", "Ice", "Impulses", "Insanity", "Insects", "Jelly", "Jokes", "Juniors", "Laughter", "Liberty", "Light", "Liquid", "Luck", "Magic", "Masks", "Mayhem", "Midnight", "Mirrors", "Motion", "Nightmares", "Paradise", "Pillows", "Pleasure", "Quicksand", "Rain", "Reflections", "Rhythm", "Riddles", "Scents", "Science", "Secrets", "Shadows", "Silliness", "Silly", "Smiles", "Snow", "Sparks", "Speed", "Spells", "Spirits", "Spring", "Stars", "Storms", "Strings", "Sugar", "Summer", "Surprises", "Terror", "Thrills", "Thunder", "Tunes", "Twists", "Uncertainty", "Voices", "Water", "Webs", "Whispers", "Winter", "Wishes", "Wonders"];
//     const nm4 = ["Abandoned", "Abstract", "Ancient", "Bizarre", "Blind", "Broken", "Charmed", "Colossal", "Daffy", "Dark", "Defiant", "Demonic", "Dynamic", "Enchanted", "Enchanting", "Ethereal", "Euphoric", "Forsaken", "Frozen", "Grand", "Grave", "Grim", "Hollow", "Horrific", "Hungry", "Jumbo", "Living", "Lone", "Lonely", "Merciless", "Merry", "Monster", "Monstrous"];
//     const nm5 = ["The ", ""];
//     const nm6 = ["la Balançoire", "la Chambre", "la Chute", "la Cime", "l'Expédition", "la Flèche", "la Maison", "la Pendule", "la Plongée", "la Profondeur", "la Roue", "la Salle", "la Spire", "la Vitesse", "le Bateau", "le Bord", "le Château", "le Chemin", "le Circuit", "le Coup", "l'Extrême", "le Lancement", "le Lieu", "le Manoir", "le Navire", "l'Obélisque", "le Palais", "le Passage", "le Plomb", "le Plongeon", "le Profond", "le Pylône", "le Rapides", "le Saut", "le Toboggan", "le Tour", "le Trajet", "le Vaisseau"];
//     const nm8a = ["Énergique", "Éthéré", "Abandonné", "Abstrait", "Ancien", "Antique", "Aveugle", "Avide", "Bizarre", "Cassé", "Charmé", "Colossal", "Congelé", "Creux", "Délaissé", "Démoniaque", "Diabolique", "Dynamique", "Enchanté", "Enchanteur", "Euphorique", "Foncé", "Gelé", "Gigantesque", "Grandiose", "Horrible", "Impitoyable", "Isolé", "Macabre", "Menaçant", "Monstrueux", "Obscur", "Provocant", "Sinistre", "Solitaire", "Terrifiant", "Vide", "Vivant", "Volatil", "d'Éclats", "d'Équilibre", "d'Été", "d'Éternité", "d'Étonnement", "d'Évasion", "d'Évolution", "d'Acrobaties", "d'Action", "d'Admiration", "d'Ambition", "d'Amusement", "d'Augure", "d'Automne", "d'Aventure", "d'Enchantement", "d'Explosions", "d'Extase", "d'Extrême", "d'Harmonie", "d'Hilarité", "d'Hiver", "d'Horreur", "d'Impulsion", "d'Incertitude", "d'Inondation", "d'Ivoire", "d'Obscurité", "d'Ombre", "d'Or", "d'Ouragans", "d'Une Autre Dimension", "de Balance", "de Balles", "de Ballons", "de Bataille", "de Batailles", "de Beauté", "de Bijoux", "de Blagues", "de Bombardement", "de Bonbons", "de Bougies", "de Bravoure", "de Brouillard", "de Brume", "de Brutalité", "de Châtiment", "de Chance", "de Changement", "de Chaos", "de Charme", "de Charmes", "de Clarté", "de Comètes", "de Commandos", "de Confiance", "de Courage", "de Crainte", "de Crochets", "de Croyance", "de Débuts", "de Découverte", "de Délice", "de Démons", "de Désir", "de Danse", "de Destin", "de Diamant", "de Fascination", "de Feu", "de Folie", "de Force", "de Fortune", "de Frisson", "de Glace", "de Gourmandise", "de Gravité", "de Jugement", "de Justice", "de Laiton", "de Libération", "de Liberté", "de Liquide", "de Lueur", "de Lumière", "de Magie", "de Maléfice", "de Merveilles", "de Minuit", "de Mort", "de Mystère", "de Neige", "de Niaiserie", "de Nuages", "de Paradis", "de Pensées", "de Perles", "de Peur", "de Plaisir", "de Pluie", "de Présage", "de Printemps", "de Prison", "de Réflexion", "de Rêves", "de Rigolade", "de Rire", "de Rochers", "de Rubis", "de Ruine", "de Rythme", "de Séismes", "de Sang", "de Science", "de Sensation", "de Songerie", "de Sortilèges", "de Sottise", "de Stupéfaction", "de Stupeur", "de Sucre", "de Surprise", "de Suspense", "de Ténèbres", "de Tendresse", "de Tonnerre", "de Trépidation", "de Tremblements", "de Vaillance", "de Verre", "de Vibrations", "de Vitesse", "de l'Échappatoire", "de l'Énigme", "de l'Étoile", "de l'Abîme", "de l'Abysse", "de l'Ange", "de l'Arachnide", "de l'Arche", "de l'Expédition", "de l'Ombre", "de l'Oracle", "de l'Orage", "de la Bête", "de la Chimère", "de la Couronne", "de la Croix", "de la Crypte", "de la Fissure", "de la Gorge", "de la Lame", "de la Malédiction", "de la Nuit", "de la Panthère", "de la Rivière", "de la Ruine", "de la Tornade", "de la Tour", "de la Vidision", "des Énigmes", "des Étincelles", "des Étoiles", "des Îles", "des Anges", "des Appareils", "des Bêtes", "des Bombes", "des Bulles", "des Canons", "des Cauchemars", "des Chaînes", "des Chutes", "des Coussins", "des Créatures", "des Dimensions", "des Esprits", "des Expéditions", "des Fantômes", "des Filous", "des Flammes", "des Insectes", "des Juniors", "des Lumières", "des Mélodies", "des Malédictions", "des Mammouths", "des Masques", "des Merveilles", "des Miracles", "des Miroirs", "des Monstres", "des Ombres", "des Oreillers", "des Os", "des Parfums", "des Pattes", "des Pennes", "des Plongeurs", "des Plumes", "des Sables Mouvants", "des Secrets", "des Souhaits", "des Sourires", "des Spectres", "des Stalactites", "des Surprises", "des Toiles", "des Traîtres", "des Trucs", "des Vœux", "des Vagues", "des Voiles", "des Voix", "des Voyages", "du Banquet", "du Baron", "du Bassin", "du Bombardier", "du Brouillard", "du Cœur", "du Canyon", "du Château", "du Comte", "du Condor", "du Démon", "du Détective", "du Diable", "du Filou", "du Fleuve", "du Flox", "du Gouffre", "du Jardin", "du Kraken", "du Léopard", "du Magnat", "du Masque", "du Poulpe", "du Prodige", "du Serpent", "du Trône", "du Typhon", "du Vol", "du Volcan", "du Zéphyr"];
//     const nm8b = ["Énergique", "Éthérée", "Abandonnée", "Abstraite", "Ancienne", "Antique", "Aveugle", "Avide", "Bizarre", "Cassée", "Charmée", "Colossale", "Congelée", "Creuse", "Délaissée", "Démoniaque", "Diabolique", "Dynamique", "Enchantée", "Enchanteresse", "Euphorique", "Foncée", "Gelée", "Gigantesque", "Grandiose", "Horrible", "Impitoyable", "Isolée", "Macabre", "Menaçante", "Monstrueuse", "Obscure", "Provocante", "Sinistre", "Solitaire", "Terrifiante", "Vide", "Vivante", "Volatile"];
//     let br = "";

//     const element = document.createElement("div");

//     element.setAttribute("id", "result");

//     for (i = 0; i < 10; i++)
//     {
//         if (tp === 1)
//         {
//             rnd2 = Math.random() * nm6.length | 0;
//             rnd = Math.random() * nm8a.length | 0;
//             if (rnd2 < 14 && rnd < 39)
//             {
//                 names = nm6[rnd2] + " " + nm8b[rnd];
//                 nm8a.splice(rnd, 1);
//                 nm8b.splice(rnd, 1);
//             }
//         else
// {
//                 names = nm6[rnd2] + " " + nm8a[rnd];
//                 nm8a.splice(rnd, 1);
//             }
//             nm6.splice(rnd2, 1);
//         }
//         else
//         {
//             rnd2 = Math.random() * nm2.length | 0;
//             if (i < 2)
//             {
//                 rnd = Math.random() * nm1.length | 0;
//                 rnd3 = Math.random() * nm5.length | 0;
//                 names = nm5[rnd3] + nm1[rnd] + " " + nm2[rnd2];
//                 nm1.splice(rnd, 1);
//             }
//             else if (i < 4)
//             {
//                 rnd = Math.random() * nm1.length | 0;
//                 names = "The " + nm1[rnd];
//                 nm1.splice(rnd, 1);
//             }
//             else if (i < 6)
//             {
//                 rnd = Math.random() * nm4.length | 0;
//                 names = "The " + nm4[rnd] + " " + nm2[rnd2];
//                 nm4.splice(rnd, 1);
//             }
//             else
//             {
//                 rnd = Math.random() * nm3.length | 0;
//                 names = nm2[rnd2] + " of " + nm3[rnd];
//                 nm3.splice(rnd, 1);
//             }
//             nm2.splice(rnd2, 1);
//         }
//         br = document.createElement('br');
//         element.appendChild(document.createTextNode(names));
//         element.appendChild(br);
//     }
//     if (document.getElementById("result"))
//     {
//         document.getElementById("placeholder").removeChild(document.getElementById("result"));
//     }
//     document.getElementById("placeholder").appendChild(element);
// }
