// /* eslint-disable max-len */
// function nameGen(type)
// {
//     const tp = type;
//     const nm1 = ["Abyss", "Adventure", "Aftermath", "Ambition", "Angel", "Apparatus", "Arachnid", "Arch", "Balance", "Balloon", "Baron", "Basin", "Loophole", "Expedition", "Battle", "Beast", "Beauty", "Blade", "Bluff", "Bomb", "Bomber", "Boost", "Boulder", "Brass", "Brass Knuckle", "Bridge", "Brutality", "Bullet", "Candle", "Cannon", "Canyon", "Chain", "Chaos", "Chasm", "Chimera", "Cliffhanger", "Comet", "Commando", "Condor", "Cork", "Count", "Courage", "Crook", "Cross", "Crown", "Curse", "Curtain", "Curve", "Daemon", "Death", "Delight", "Demon", "Desire", "Devil", "Diamond", "Dimension", "Diver", "Divide", "Division", "Dread", "Dream", "Dreamscape", "Earthquake", "Enchantment", "Enigma", "Eruption", "Escape", "Eternity", "Eventide", "Evolution", "Explosion", "Extreme", "Fall", "Feather", "Figure", "Fire", "Fireball", "Flake", "Flame", "Flight", "Flock", "Fluke", "Flux", "Fog", "Force", "Fortune", "Freedom", "Garden", "Ghost", "Glass", "Glutton", "Gravity", "Heart", "Heartbeat", "Hook", "Horror", "Hurricane", "Icicle", "Impulse", "Island", "Jewel", "Judgment", "Justice", "Knockout", "Kraken", "Leopard", "Mammoth", "Medium", "Meteor", "Miracle", "Mirror", "Mist", "Motion", "Night", "Nightmare", "Octopus", "Omen", "Operation", "Oracle", "Panther", "Phantom", "Phase", "Prison", "Pulse", "Punishment", "Quake", "Quicksand", "Quill", "Reflection", "Regret", "Requiem", "Response", "Rhythm", "Riddle", "Ride", "River", "Ruin", "Serpent", "Servant", "Shade", "Shadow", "Shift", "Shock", "Signal", "Snake", "Snowflake", "Sparkle", "Spell", "Split", "Star", "Stitch", "Storm", "Switch", "Switcheroo", "Thrill", "Throne", "Thunder", "Tornado", "Tower", "Tremor", "Trick", "Twist", "Twister", "Typhoon", "Vault", "Volcano", "Voyage", "Wave", "Wipeout", "Wonder", "Zephyr"];
//     const nm2 = ["Boat", "Bungee", "Coaster", "Coil", "Depth", "Diver", "Drop", "Edge", "Expedition", "Extreme", "House", "Hall", "Loop", "Manor", "Mansion", "Obelisk", "Palace", "Pass", "Passage", "Pendulum", "Place", "Plummet", "Plunge", "Rapids", "Release", "Ride", "Rider", "Shot", "Slide", "Spire", "Supreme", "Swing", "Tower", "Tumble", "Wheel"];
//     const nm3 = ["Acrobatics", "Action", "Adventure", "Amazement", "Autumn", "Awe", "Balance", "Battle", "Beginnings", "Belief", "Blood", "Bones", "Bravery", "Bubbles", "Candy", "Chains", "Chaos", "Clarity", "Clouds", "Courage", "Creatures", "Cushions", "Dance", "Darkness", "Death", "Delight", "Desire", "Discovery", "Doom", "Dread", "Dreams", "Ecstasy", "Eternity", "Fascination", "Fear", "Feasts", "Fire", "Flame", "Flukes", "Fortune", "Fun", "Ghosts", "Glass", "Gluttony", "Gold", "Harmony", "Hilarity", "Horror", "Ice", "Impulses", "Insanity", "Insects", "Jelly", "Jokes", "Juniors", "Laughter", "Liberty", "Light", "Liquid", "Luck", "Magic", "Masks", "Mayhem", "Midnight", "Mirrors", "Motion", "Nightmares", "Paradise", "Pillows", "Pleasure", "Quicksand", "Rain", "Reflections", "Rhythm", "Riddles", "Scents", "Science", "Secrets", "Shadows", "Silliness", "Silly", "Smiles", "Snow", "Sparks", "Speed", "Spells", "Spirits", "Spring", "Stars", "Storms", "Strings", "Sugar", "Summer", "Surprises", "Terror", "Thrills", "Thunder", "Tunes", "Twists", "Uncertainty", "Voices", "Water", "Webs", "Whispers", "Winter", "Wishes", "Wonders"];
//     const nm4 = ["Abandoned", "Abstract", "Ancient", "Bizarre", "Blind", "Broken", "Charmed", "Colossal", "Daffy", "Dark", "Defiant", "Demonic", "Dynamic", "Enchanted", "Enchanting", "Ethereal", "Euphoric", "Forsaken", "Frozen", "Grand", "Grave", "Grim", "Hollow", "Horrific", "Hungry", "Jumbo", "Living", "Lone", "Lonely", "Merciless", "Merry", "Monster", "Monstrous"];
//     const nm5 = ["The ", ""];
//     const nm6 = ["la Balan??oire", "la Chambre", "la Chute", "la Cime", "l'Exp??dition", "la Fl??che", "la Maison", "la Pendule", "la Plong??e", "la Profondeur", "la Roue", "la Salle", "la Spire", "la Vitesse", "le Bateau", "le Bord", "le Ch??teau", "le Chemin", "le Circuit", "le Coup", "l'Extr??me", "le Lancement", "le Lieu", "le Manoir", "le Navire", "l'Ob??lisque", "le Palais", "le Passage", "le Plomb", "le Plongeon", "le Profond", "le Pyl??ne", "le Rapides", "le Saut", "le Toboggan", "le Tour", "le Trajet", "le Vaisseau"];
//     const nm8a = ["??nergique", "??th??r??", "Abandonn??", "Abstrait", "Ancien", "Antique", "Aveugle", "Avide", "Bizarre", "Cass??", "Charm??", "Colossal", "Congel??", "Creux", "D??laiss??", "D??moniaque", "Diabolique", "Dynamique", "Enchant??", "Enchanteur", "Euphorique", "Fonc??", "Gel??", "Gigantesque", "Grandiose", "Horrible", "Impitoyable", "Isol??", "Macabre", "Mena??ant", "Monstrueux", "Obscur", "Provocant", "Sinistre", "Solitaire", "Terrifiant", "Vide", "Vivant", "Volatil", "d'??clats", "d'??quilibre", "d'??t??", "d'??ternit??", "d'??tonnement", "d'??vasion", "d'??volution", "d'Acrobaties", "d'Action", "d'Admiration", "d'Ambition", "d'Amusement", "d'Augure", "d'Automne", "d'Aventure", "d'Enchantement", "d'Explosions", "d'Extase", "d'Extr??me", "d'Harmonie", "d'Hilarit??", "d'Hiver", "d'Horreur", "d'Impulsion", "d'Incertitude", "d'Inondation", "d'Ivoire", "d'Obscurit??", "d'Ombre", "d'Or", "d'Ouragans", "d'Une Autre Dimension", "de Balance", "de Balles", "de Ballons", "de Bataille", "de Batailles", "de Beaut??", "de Bijoux", "de Blagues", "de Bombardement", "de Bonbons", "de Bougies", "de Bravoure", "de Brouillard", "de Brume", "de Brutalit??", "de Ch??timent", "de Chance", "de Changement", "de Chaos", "de Charme", "de Charmes", "de Clart??", "de Com??tes", "de Commandos", "de Confiance", "de Courage", "de Crainte", "de Crochets", "de Croyance", "de D??buts", "de D??couverte", "de D??lice", "de D??mons", "de D??sir", "de Danse", "de Destin", "de Diamant", "de Fascination", "de Feu", "de Folie", "de Force", "de Fortune", "de Frisson", "de Glace", "de Gourmandise", "de Gravit??", "de Jugement", "de Justice", "de Laiton", "de Lib??ration", "de Libert??", "de Liquide", "de Lueur", "de Lumi??re", "de Magie", "de Mal??fice", "de Merveilles", "de Minuit", "de Mort", "de Myst??re", "de Neige", "de Niaiserie", "de Nuages", "de Paradis", "de Pens??es", "de Perles", "de Peur", "de Plaisir", "de Pluie", "de Pr??sage", "de Printemps", "de Prison", "de R??flexion", "de R??ves", "de Rigolade", "de Rire", "de Rochers", "de Rubis", "de Ruine", "de Rythme", "de S??ismes", "de Sang", "de Science", "de Sensation", "de Songerie", "de Sortil??ges", "de Sottise", "de Stup??faction", "de Stupeur", "de Sucre", "de Surprise", "de Suspense", "de T??n??bres", "de Tendresse", "de Tonnerre", "de Tr??pidation", "de Tremblements", "de Vaillance", "de Verre", "de Vibrations", "de Vitesse", "de l'??chappatoire", "de l'??nigme", "de l'??toile", "de l'Ab??me", "de l'Abysse", "de l'Ange", "de l'Arachnide", "de l'Arche", "de l'Exp??dition", "de l'Ombre", "de l'Oracle", "de l'Orage", "de la B??te", "de la Chim??re", "de la Couronne", "de la Croix", "de la Crypte", "de la Fissure", "de la Gorge", "de la Lame", "de la Mal??diction", "de la Nuit", "de la Panth??re", "de la Rivi??re", "de la Ruine", "de la Tornade", "de la Tour", "de la Vidision", "des ??nigmes", "des ??tincelles", "des ??toiles", "des ??les", "des Anges", "des Appareils", "des B??tes", "des Bombes", "des Bulles", "des Canons", "des Cauchemars", "des Cha??nes", "des Chutes", "des Coussins", "des Cr??atures", "des Dimensions", "des Esprits", "des Exp??ditions", "des Fant??mes", "des Filous", "des Flammes", "des Insectes", "des Juniors", "des Lumi??res", "des M??lodies", "des Mal??dictions", "des Mammouths", "des Masques", "des Merveilles", "des Miracles", "des Miroirs", "des Monstres", "des Ombres", "des Oreillers", "des Os", "des Parfums", "des Pattes", "des Pennes", "des Plongeurs", "des Plumes", "des Sables Mouvants", "des Secrets", "des Souhaits", "des Sourires", "des Spectres", "des Stalactites", "des Surprises", "des Toiles", "des Tra??tres", "des Trucs", "des V??ux", "des Vagues", "des Voiles", "des Voix", "des Voyages", "du Banquet", "du Baron", "du Bassin", "du Bombardier", "du Brouillard", "du C??ur", "du Canyon", "du Ch??teau", "du Comte", "du Condor", "du D??mon", "du D??tective", "du Diable", "du Filou", "du Fleuve", "du Flox", "du Gouffre", "du Jardin", "du Kraken", "du L??opard", "du Magnat", "du Masque", "du Poulpe", "du Prodige", "du Serpent", "du Tr??ne", "du Typhon", "du Vol", "du Volcan", "du Z??phyr"];
//     const nm8b = ["??nergique", "??th??r??e", "Abandonn??e", "Abstraite", "Ancienne", "Antique", "Aveugle", "Avide", "Bizarre", "Cass??e", "Charm??e", "Colossale", "Congel??e", "Creuse", "D??laiss??e", "D??moniaque", "Diabolique", "Dynamique", "Enchant??e", "Enchanteresse", "Euphorique", "Fonc??e", "Gel??e", "Gigantesque", "Grandiose", "Horrible", "Impitoyable", "Isol??e", "Macabre", "Mena??ante", "Monstrueuse", "Obscure", "Provocante", "Sinistre", "Solitaire", "Terrifiante", "Vide", "Vivante", "Volatile"];
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
