import * as L from "leaflet";

export type Streets = Array<string>;

export enum StateMarker{
    NotSave = '#007FFF',
    Save = '#8BC34A',
}

export enum ColorStreets{
    street1 = "#F3E2A9",
    street2 = "#A9D0F5"
}

export interface mapStreet{
    street: number,
    directions: Array<string>,
    color:string,
}

export interface LocationCross{
    suburb : string;
    city: string;
    state : string,
    country: string,
}

export enum StreetsNames{
    salamanca = "Avd de Salamanca",
    bosco = "Calle San Bosco",
    estacion = "Avd de la Estación",
    entradaStacion = "Entrada Estación",
    rotondaSalamanca = "Rotonda Avnd Salamanca",
    glorieta = "Glorieta de la Estrella",
    maisonave = "Avd de Misonave",
    churruca = "Calle Churruca",
    aguilera = "Avnd Aguilera",
    oscar = "Avd Oscar Esplá",
    castellar = "Calle Castellar",
    carlet = "Calle Carlet",
    foglietti = "Calle Foglietti",
    senanteLauder = "Calle Catedrático Senante Laudes",
    serrano = "Calle Serrano",
    pintorAparicio = "Calle Pintor Aparicio",
    arquitectoMorell = "Calle Arquitecto Morell",
    reyes = "Calle Reyes Católicos",
    pintorLorenzo = "Calle Pintor Lorenzo Casanova",
    ferreVidielia = "Calle Catedrático Ferre Vidiella",
    generalLacy = "Calle general Lacy",
    pintorCabrera = "Calle Pintor Cabrera",
    portugal = "Calle Portugal",
    tucuman = "Calle Tucuman",
    odonnel = "Calle general O'Donnell",
    poetaVila = "Calle Poeta Vila y Blanco",
    paris = "Calle París",
    alemania = "Calle Alemania",
    plazaLuceros = "Plaza Luceros",
    marva = "Avnd general Marvá",
    alfonso = "Avnd Alfonso X El Sabio",
    federicoSoto = "Avnd Federico Soto",
    medico = "Calle médico Pascual Pérez",
    teatro = "Calle del Teatro",
    colon = "Calle Colón",
    pintorAgrasot = "Calle Pintor Agrasot",
    doctorGadea = "Avnd Doctor Gadea",
    calvo = "Plaza de Calvo Sotelo",
    canalejas = "Calle Canalejas" ,   
    montaña = "Plaza de la montaña",
    gerona = "Calle Gerona",
    baron = "Calle Barón de Finestrat",
    cid = "Calle del Cid",
    gtaEstrella = "Gta de la Estrella",
    forges = "Calle Humorista Gráfico Forges",
    parkingAvdEstacion = "Parking Avd Estación",
    parkingCorte = "Parking Corte Inglés",
    parkingMercadona = "Parking Mercadona",
    parkingMaiso = "Parking Maisonave",
    correos = "Correos",
    glorietaOscar = "Avda. Oscar Esplá (Glorieta)",
    glorietaMaiso = "Avda. Maisonnave (Glorieta)",
    glorietaSalamanca = "Avda. Salamanca (Glorieta)",
    glorietaAguilera = "Avda. Aguilera (Glorieta)",
    parkingRenfe = "Acceso Parking Renfe"
}

export class Crosses  {
    private id : number;
    private name : string;
    private streets : Streets;
    private coordinates : L.LatLng;
    private state : StateMarker = StateMarker.NotSave;
    private carsCount : Map<string,number>;
    private vehicleCount : Map<string, number>;
    private timeCount : string = "00:00";
    private location: LocationCross;
    private directions: Array<mapStreet>;

    public static readonly allEnums : Array<Crosses> = new Array<Crosses>();
    public static readonly p1 = new Crosses(0, "P1", [StreetsNames.salamanca], L.latLng([ 38.34554960092743, -0.4944425032281785 ]), [{ street: 0, directions:['Entra'], color: ColorStreets.street1 }] ); 
    public static readonly p2 = new Crosses(1, "P2", [StreetsNames.estacion], L.latLng([ 38.34460847442167, -0.49458834454923833 ]), [{ street: 0, directions:['GIRA/SUBE', 'GIRA/BAJA', 'RECTO/CORREOS'], color: ColorStreets.street1 }] ); 
    public static readonly p3 = new Crosses(2, "P3", [StreetsNames.salamanca, StreetsNames.parkingRenfe], L.latLng([ 38.34397369263218, -0.49461950659276394 ]), [{street:0, directions:['Recto'],color: ColorStreets.street1}, {street:1, directions:['Entra'], color: ColorStreets.street2}] );
    public static readonly p4 = new Crosses(3, "P4", [StreetsNames.salamanca], L.latLng([ 38.34419622326543, -0.4944823857729853]), [{ street: 0, directions:['RECTO', 'GIRA/SALEN'], color: ColorStreets.street1 }] );
    public static readonly p5 = new Crosses(4, "P5", [StreetsNames.salamanca, StreetsNames.parkingRenfe], L.latLng([ 38.34383209560637, -0.4943531333410878]), [{street:0, directions:['Recto', 'Gira acceso'],color: ColorStreets.street1}, {street:1, directions:['Recto avda Salamanca','Gira acceso'], color: ColorStreets.street2}] );
    public static readonly p6 = new Crosses(5, "P6", [StreetsNames.parkingRenfe], L.latLng([ 38.34356868948723, -0.49455973934849023]), [{street:0, directions:['Recto (Acceso)', 'Gira a la Glorieta'],color: ColorStreets.street1}]); 
    public static readonly p7 = new Crosses(6, "P7", [StreetsNames.gtaEstrella, StreetsNames.churruca], L.latLng([ 38.34314932723627, -0.4943670283305069 ]), [{ street: 0, directions:['Se Queda'], color: ColorStreets.street1 }, {street: 1, directions:['Salen'], color: ColorStreets.street2 }] );
    public static readonly p8 = new Crosses(7, "P8", [StreetsNames.glorietaSalamanca], L.latLng([ 38.34339126584657, -0.4946231908892918 ]), [{ street: 0, directions:['RECTO/ENTRAN', 'GIRA/SALEN'], color: ColorStreets.street1 }] );
    public static readonly p9 = new Crosses(8, "P9", [StreetsNames.glorietaAguilera], L.latLng([  38.34310868688089, -0.4947017182995262]), [{ street: 0, directions:['RECTO/ENTRAN', 'GIRA/SALEN'], color: ColorStreets.street1 }]  );
    public static readonly p10 = new Crosses(9, "P10", [StreetsNames.gtaEstrella, StreetsNames.oscar ], L.latLng([ 38.34318931009843, -0.49457292145647547]), [{ street: 0, directions:['Se Queda'], color: ColorStreets.street1 }, {street: 1, directions:['Salen'], color: ColorStreets.street2 }]);
    public static readonly p11 = new Crosses(10, "P11", [StreetsNames.glorietaMaiso], L.latLng([ 38.34334445805959, -0.49424945499813694 ]), [{ street: 0, directions:['RECTO/ENTRAN', 'GIRA/SALEN'], color: ColorStreets.street1 }] );
    public static readonly p12 = new Crosses(11, "P12", [StreetsNames.glorietaOscar, ], L.latLng([ 38.34311989600447, -0.49422892841216604]), [{ street: 0, directions:['RECTO/ENTRAN', 'GIRA/SALEN'], color: ColorStreets.street1 }]);
    // public static readonly p13 = new Crosses(12, "P13", [StreetsNames.churruca, StreetsNames.gtaEstrella], L.latLng([ 38.34296370448268, -0.49393561287394805 ]) );
    public static readonly p14 = new Crosses(13, "P14", [StreetsNames.oscar], L.latLng([ 38.342863248304226, -0.4942979748146415 ]), [{ street: 0, directions:['Recto', 'Gira'], color: ColorStreets.street1 }] );
    public static readonly p15 = new Crosses(14, "P15", [StreetsNames.oscar], L.latLng([ 38.341891332200724, -0.49438047583179945 ]), [{ street: 0, directions:['RECTO', 'GIRA (Curva)', 'Gira a BENALUA'], color: ColorStreets.street1 }]);
    public static readonly p16 = new Crosses(15, "P16", [StreetsNames.oscar, StreetsNames.foglietti], L.latLng([ 38.340892070024644, -0.494117934668250 ]), [{ street: 0, directions:['Recto', 'Gira (Curva)'], color: ColorStreets.street1 }, {street: 1, directions:['Recto (Curva)', 'Gira'], color: ColorStreets.street2 }]);
    // public static readonly p17 = new Crosses(16, "P17", [StreetsNames.oscar, StreetsNames.pintorLorenzo], L.latLng([ 38.340247532574665, -0.49393586857163113 ]) );
    public static readonly p18 = new Crosses(17, "P18", [StreetsNames.oscar], L.latLng([ 38.34211087761883, -0.494109544231165 ]), [{ street: 0, directions:['Recto', 'Gira'], color: ColorStreets.street1 }] );
    public static readonly p19 = new Crosses(18, "P19", [StreetsNames.oscar, StreetsNames.foglietti], L.latLng([ 38.34091966520304, -0.49382827368762877 ]) );
    public static readonly p20 = new Crosses(19, "P20", [StreetsNames.pintorLorenzo, StreetsNames.oscar], L.latLng([ 38.34028379744972, -0.49366097930294345 ]), [{ street: 0, directions:['Recto (Curva)', 'Gira'], color: ColorStreets.street1 }, {street: 1, directions:['Recto', 'Gira (Curva)'], color: ColorStreets.street2 }] );
    public static readonly p21 = new Crosses(20, "P21", [StreetsNames.castellar, StreetsNames.churruca], L.latLng([ 38.342352813133324, -0.49355098685951015]) );
    public static readonly p22 = new Crosses(21, "P22", [StreetsNames.arquitectoMorell, StreetsNames.churruca], L.latLng([38.341804264901675, -0.4931691029666419 ]) );
    public static readonly p23 = new Crosses(22, "P23", [StreetsNames.reyes, StreetsNames.churruca], L.latLng([ 38.341311734712406, -0.492793599743946 ]) );
    public static readonly p24 = new Crosses(23, "P24", [StreetsNames.churruca, StreetsNames.pintorLorenzo], L.latLng([ 38.34078187495748, -0.49241371469308964 ]) );
    public static readonly p25 = new Crosses(24, "P25", [StreetsNames.estacion], L.latLng([ 38.344844300731296, -0.49393290264248885]), [{ street: 0, directions:['Recto', 'Gira'], color: ColorStreets.street1 }] );
    public static readonly p26 = new Crosses(25, "P26", [StreetsNames.serrano], L.latLng([ 38.34475497197774, -0.4938618708844934]) , [{street:0, directions:['Recto', 'Gira dir.LUCEROS', 'Gira dir.RENFE'], color: ColorStreets.street1 }]);
    // public static readonly p27 = new Crosses(26, "P27", [StreetsNames.pintorCabrera, StreetsNames.serrano], L.latLng([ 38.3438564337761, -0.49318822906690546]) );
    public static readonly p28 = new Crosses(27, "P28", [StreetsNames.castellar, StreetsNames.parkingMaiso], L.latLng([ 38.34220841915206, -0.493900024626639]), [{street:0, directions:['Recto'], color: ColorStreets.street1 }, {street:1, directions:['Entra'], color: ColorStreets.street2}] );
    public static readonly p29 = new Crosses(28, "P29", [StreetsNames.maisonave, StreetsNames.pintorAparicio], L.latLng([ 38.34330289277624, -0.4928126998486038 ]) );
    public static readonly p30 = new Crosses(29, "P30", [StreetsNames.parkingCorte], L.latLng([ 38.34285245863987, -0.492486825764007 ]), [{ street: 0, directions:['Salen'], color: ColorStreets.street1 }] );
    public static readonly p31 = new Crosses(30, "P31", [StreetsNames.arquitectoMorell, StreetsNames.pintorAparicio], L.latLng([38.3422769357941, -0.492066368173183]) );
    public static readonly p32 = new Crosses(31, "P32", [StreetsNames.reyes, StreetsNames.pintorAparicio], L.latLng([ 38.34178954660929, -0.49173414477605043 ]) );
    public static readonly p33 = new Crosses(32, "P33", [StreetsNames.pintorLorenzo, StreetsNames.pintorAparicio], L.latLng([ 38.34125232265091, -0.4913381664711048 ]) );
    public static readonly p34 = new Crosses(33, "P34", [StreetsNames.ferreVidielia], L.latLng([ 38.34530185663312, -0.4926976561546326 ]), [{ street: 0, directions:['Recto', 'Gira a RENFE', 'Gira a Luceros'], color: ColorStreets.street1 }] );
    public static readonly p35 = new Crosses(34, "P35", [StreetsNames.estacion], L.latLng([ 38.345234014881754,  -0.49265306442976003 ]), [{ street: 0, directions:['Recto', 'Gira'], color: ColorStreets.street1 }] );
    public static readonly p36 = new Crosses(35, "P36", [StreetsNames.pintorCabrera, StreetsNames.generalLacy], L.latLng([ 38.344361308722526, -0.4920090507186804 ]) );
    public static readonly p37 = new Crosses(36, "P37", [StreetsNames.generalLacy], L.latLng([38.34381199457977, -0.4916040392580912 ]), [{ street: 0, directions:['Recto', 'Gira'], color: ColorStreets.street1 }]);
    // public static readonly p38 = new Crosses(37, "P38", [StreetsNames.maisonave, StreetsNames.generalLacy], L.latLng([ 38.343476446107815, -0.49135795025711415]) );
    public static readonly p39 = new Crosses(38, "P39", [StreetsNames.generalLacy], L.latLng([ 38.34337048954576, -0.49128453240022024 ]) ,[{street:0, directions:['Recto','Gira'], color: ColorStreets.street2}] );
    public static readonly p40 = new Crosses(39, "P40", [StreetsNames.paris, StreetsNames.portugal], L.latLng([ 38.342841925338284, -0.4909026538107497 ]) );
    public static readonly p41 = new Crosses(40, "P41", [StreetsNames.reyes, StreetsNames.portugal], L.latLng([ 38.342325478826034, -0.4905321734279978 ]) );
    public static readonly p42 = new Crosses(41, "P42", [StreetsNames.portugal, StreetsNames.pintorLorenzo], L.latLng([  38.341783242045054, -0.49013354547419175 ]) );
    public static readonly p43 = new Crosses(42, "P43", [StreetsNames.estacion], L.latLng([ 38.34564316573634, -0.49176934719387116]), [{ street: 0, directions:['Recto', 'Gira'], color: ColorStreets.street1 }] );
    // public static readonly p44 = new Crosses(43, "P44", [StreetsNames.estacion, StreetsNames.odonnel], L.latLng([ 38.34557039636586, -0.4917204118465169 ]) );
    public static readonly p45 = new Crosses(44, "P45", [StreetsNames.pintorCabrera, StreetsNames.odonnel], L.latLng([ 38.34476759279728, -0.4911162239158107]) );
    public static readonly p46 = new Crosses(45, "P46", [StreetsNames.poetaVila, StreetsNames.odonnel], L.latLng([38.34419908559065, -0.490701833651448 ]) );
    // public static readonly p47 = new Crosses(46, "P47", [StreetsNames.maisonave, StreetsNames.odonnel], L.latLng([ 38.34354799072676, -0.49022037726456974 ]) );
    public static readonly p48 = new Crosses(47, "P48", [StreetsNames.maisonave, StreetsNames.alemania], L.latLng([ 38.343434414063104, -0.49013857395963983 ]) );
    public static readonly p49 = new Crosses(48, "P49", [StreetsNames.alemania], L.latLng([ 38.34289794100159, -0.48976404955323183]), [{ street: 0, directions:['Recto', 'Gira'], color: ColorStreets.street1 }] );
    public static readonly p50 = new Crosses(49, "P50", [StreetsNames.reyes, StreetsNames.alemania], L.latLng([ 38.34268575550704, -0.48961386038784754 ]) );
    public static readonly p51 = new Crosses(50, "P51", [StreetsNames.pintorLorenzo, StreetsNames.alemania], L.latLng([ 38.342186930246854, -0.4892641710636703]) );
    public static readonly p52 = new Crosses(51, "P52", [StreetsNames.plazaLuceros, `${StreetsNames.estacion} (Curva)`], L.latLng([ 38.34607365564175, -0.490917375141724 ]), [{ street: 0, directions:['Se Queda'], color: ColorStreets.street1 }, {street: 1, directions:['Salen'], color: ColorStreets.street2 }]  );
    public static readonly p53 = new Crosses(52, "P53", [StreetsNames.plazaLuceros, StreetsNames.marva], L.latLng([ 38.346204867060514, -0.490555983155967 ]), [{ street: 0, directions:['Se Queda'], color: ColorStreets.street1 }, {street: 1, directions:['Salen'], color: ColorStreets.street2 }] );
    public static readonly p54 = new Crosses(53, "P54", [StreetsNames.plazaLuceros, StreetsNames.alfonso], L.latLng([38.34586434474904, -0.4903598361471718 ]), [{ street: 0, directions:['Se Queda'], color: ColorStreets.street1 }, {street: 1, directions:['Salen'], color: ColorStreets.street2 }] );
    public static readonly p55 = new Crosses(54, "P55", [StreetsNames.plazaLuceros, StreetsNames.federicoSoto], L.latLng([38.34577023992544, -0.4907768841664107 ]), [{ street: 0, directions:['Se Queda'], color: ColorStreets.street1 }, {street: 1, directions:['Salen'], color: ColorStreets.street2 }]  );
    public static readonly p56 = new Crosses(55, "P56", [StreetsNames.federicoSoto], L.latLng([ 38.345160696261566, -0.49023143205511277 ]), [{ street: 0, directions:['RECTO', 'GIRA'], color: ColorStreets.street1 }]);
    public static readonly p57 = new Crosses(56, "P57", [StreetsNames.medico], L.latLng([ 38.345432817438414, -0.4895502261988294 ]), [{ street: 0, directions:['Entra'], color: ColorStreets.street1 }] );
    // public static readonly p58 = new Crosses(57, "P58", [StreetsNames.federicoSoto, StreetsNames.poetaVila], L.latLng([ 38.34459009180016, -0.48982372144895653 ]) );
    public static readonly p59 = new Crosses(58, "P59", [StreetsNames.federicoSoto], L.latLng([ 38.34470657598048, -0.4895618852358853 ]), [{ street: 0, directions:['RECTO', 'GIRA'], color: ColorStreets.street1 }] );
    public static readonly p60 = new Crosses(59, "P60", [StreetsNames.colon], L.latLng([ 38.34436237735333, -0.48902141509260544 ]), [{ street: 0, directions:['Entra'], color: ColorStreets.street1 }] );
    public static readonly p61 = new Crosses(60, "P61", [StreetsNames.federicoSoto], L.latLng([ 38.34397394489719, -0.48903849885177275 ]), [{ street: 0, directions:['RECTO', 'GIRA'], color: ColorStreets.street1 }]);
    public static readonly p62 = new Crosses(61, "P62", [StreetsNames.calvo, StreetsNames.federicoSoto], L.latLng([ 38.34357559974233, -0.4890730480477368 ]), [{ street: 0, directions:['Recto a Maisonnave', 'Gira'], color: ColorStreets.street1 }, {street: 1, directions:['Recto', 'Gira a Maisonnave'], color: ColorStreets.street2 }] );
    public static readonly p63 = new Crosses(62, "P63", [StreetsNames.doctorGadea, StreetsNames.calvo], L.latLng([ 38.343673405946966, -0.4888551282808052 ]), [{ street: 0, directions:['Recto', 'Gira (Curva)'], color: ColorStreets.street1 }, {street: 1, directions:['Recto (Curva)', 'Gira'], color: ColorStreets.street2 }]);
    // public static readonly p64 = new Crosses(63, "P64", [StreetsNames.calvo, StreetsNames.doctorGadea], L.latLng([ 38.34371012675584, -0.4880232790646955 ]) );
    // public static readonly p65 = new Crosses(64, "P65", [StreetsNames.gerona, StreetsNames.montaña], L.latLng([ 38.34376881842664, -0.48769130978485015]) );
    // public static readonly p66 = new Crosses(65, "P66", [StreetsNames.calvo, StreetsNames.baron], L.latLng([ 38.343659615128104, -0.4875675851871232 ]) );
    // public static readonly p67 = new Crosses(66, "P67", [StreetsNames.calvo, StreetsNames.canalejas], L.latLng([ 38.34344227066541, -0.48804172489597797 ]) );
    public static readonly p68 = new Crosses(67, "P68", [StreetsNames.reyes, StreetsNames.doctorGadea], L.latLng([ 38.343206713822966, -0.48852489337462446 ]) );
    public static readonly p69 = new Crosses(68, "P69", [StreetsNames.doctorGadea, StreetsNames.reyes], L.latLng([ 38.34311963045113, -0.48874918063085193 ]), [{ street: 0, directions:['Recto', 'Gira (Curva)'], color: ColorStreets.street1 }, {street: 1, directions:['Recto (Curva)', 'Gira'], color: ColorStreets.street2 }] );
    public static readonly p70 = new Crosses(69, "P70", [StreetsNames.doctorGadea], L.latLng([ 38.34258608248451, -0.4883629375436583 ]), [{ street: 0, directions:['RECTO', 'GIRA'], color: ColorStreets.street1 }] );
    public static readonly p71 = new Crosses(70, "P71", [StreetsNames.doctorGadea], L.latLng([ 38.34308278951858, -0.48839982028919593 ]), [{ street: 0, directions:['RECTO', 'Gira Cambio de Sentido'], color: ColorStreets.street1 }] );
    // public static readonly p72 = new Crosses(71, "P72", [StreetsNames.oscar, StreetsNames.arquitectoMorell ], L.latLng([ 38.34144740982445, -0.49396372064769667]) );
    public static readonly p73 = new Crosses(72, "P73", [StreetsNames.salamanca, StreetsNames.correos ], L.latLng([ 38.34493687778025, -0.4947005957365036]), [{ street: 0, directions:['Recto', 'Gira a Correos'], color: ColorStreets.street1 }, {street: 1, directions:['Salen de Correos', 'Entra x Taxis'], color: ColorStreets.street2 }] ); 
    public static readonly p74 = new Crosses(73, "P74", [StreetsNames.churruca, StreetsNames.parkingCorte ], L.latLng([ 38.34244066380582, -0.4935690928832904]), [{ street: 0, directions:['Recto'], color: ColorStreets.street1 }, {street: 1, directions:['Entra'], color: ColorStreets.street2 }]);
    public static readonly p75 = new Crosses(74, "P75", [StreetsNames.reyes, StreetsNames.parkingMercadona ], L.latLng([ 38.341503992112685, -0.49223536071908]), [{ street: 0, directions:['Recto'], color: ColorStreets.street1 }, {street: 1, directions:['Entra', 'Salen'], color: ColorStreets.street2 }] );   
    public static readonly p76 = new Crosses(75, "P76", [StreetsNames.gtaEstrella, StreetsNames.salamanca ], L.latLng([ 38.34327791456347, -0.4943110689683428]), [{ street: 0, directions:['Se Queda'], color: ColorStreets.street1 }, {street: 1, directions:['Salen'], color: ColorStreets.street2 }] );   
    public static readonly p77 = new Crosses(76, "P77", [`${StreetsNames.estacion} (Curva)`, StreetsNames.parkingAvdEstacion ], L.latLng([ 38.344602519899965, -0.49431926597087955]), [{street:0, directions:['Recto'], color: ColorStreets.street1 }, {street:1, directions:['Entra'], color: ColorStreets.street2}] );   
    public static readonly p78 = new Crosses(77, "P78", [StreetsNames.gtaEstrella, StreetsNames.aguilera ], L.latLng([ 38.3433113128404, -0.4945682166578647]), [{ street: 0, directions:['Se Queda'], color: ColorStreets.street1 }, {street: 1, directions:['Salen'], color: ColorStreets.street2 }] );
    public static readonly p79 = new Crosses(78, "P79", [StreetsNames.estacion, StreetsNames.parkingAvdEstacion ], L.latLng([ 38.3458067677664, -0.49128884904454223]), [{ street: 0, directions:['Recto'], color: ColorStreets.street1 }, {street: 1, directions:['Entra'], color: ColorStreets.street2 }] );
    public static readonly p80 = new Crosses(79, "P80", [StreetsNames.alfonso ], L.latLng([ 38.34626507165291, -0.48988005162342146]), [{ street: 0, directions:['Entra'], color: ColorStreets.street1 }] );
    public static readonly p81 = new Crosses(80, "P81", [StreetsNames.marva ], L.latLng([ 38.34650226555501, -0.49102835605688183]), [{ street: 0, directions:['Entra'], color: ColorStreets.street1 }] );
    public static readonly p82 = new Crosses(81, "P82", [`${StreetsNames.parkingAvdEstacion} Renfe` ], L.latLng([ 38.34503183443796, -0.49337562219158315]), [{ street: 0, directions:['Salen'], color: ColorStreets.street1 }]);
    public static readonly p83 = new Crosses(82, "P83", [`${StreetsNames.parkingAvdEstacion} Luceros` ], L.latLng([ 38.34527663039012, -0.49233695684864914]),[{ street: 0, directions:['Salen'], color: ColorStreets.street1 }]);
    public static readonly p84 = new Crosses(83, "P84", [StreetsNames.parkingMaiso ], L.latLng([ 38.343042294534605, -0.49102333372343276]), [{ street: 0, directions:['Salen'], color: ColorStreets.street1 }]);

    constructor(id:number, name:string, streets: Streets, 
        coordenates: L.LatLng,
        directions: Array<mapStreet> = [{ street: 0, directions:['Recto', 'Gira'],
        color: ColorStreets.street1 },
        {street: 1, directions:['Recto', 'Gira'],
        color: ColorStreets.street2 }],
        carsCount: Map<string, number> = new Map(),
        vehicleCount: Map<string, number> = new Map(),
        state: StateMarker = StateMarker.NotSave, timeCount: string = "00:00",
        location: LocationCross = { suburb : '', city : '', state : '', country : ''}){
        this.id = id;
        this.name = name;
        this.streets = streets;
        this.coordinates = coordenates;
        this.directions = directions;
        this.carsCount = carsCount;
        this.vehicleCount = vehicleCount;
        this.state = state;
        this.location = location;
        Crosses.allEnums.push(this);
    }

    static build(data: Crosses): Crosses{
        const count: Map<string, number> = new Map<string, number>(Object.entries(data.carsCount || {}));
        const countV: Map<string, number> = new Map<string, number>(Object.entries(data.vehicleCount || {}));
        return  new Crosses(data.id, 
            data.name, data.streets,
            L.latLng([data.coordinates.lat, data.coordinates.lng]),
            data.directions,
            count, countV,
            data.state,
            data.timeCount,
            data.location);
    }

    public static values(): Array<Crosses>{
        return Crosses.allEnums;
    }

    public getId():number{
        return this.id;
    }

    public static dummy(id: number, name: string, latlng: L.LatLng): Crosses{
        const cross = new Crosses(id, name, ["Default", "Default"], latlng);
        cross.setDirection([{ street: 0, directions:['Recto', 'Gira'], color: ColorStreets.street1 }]);
        
        return cross;
    }

    public static getDirection2(): Array<mapStreet>{
        return ([{ street: 0, directions:['Recto', 'Gira'], color: ColorStreets.street1 },
                 { street: 1, directions:['Recto', 'Gira'], color: ColorStreets.street2 }]);
    }

    public setName(name: string){
        this.name = name;
    }

    public getName():string{
        return this.name;
    }

    public setStreets(streets: Streets){
        this.streets = streets;
    }

    public setStreet(strees: string, index: number){
        this.streets[index] = strees;
    }

    public getStreets(): Streets{
        return this.streets;
    }

    public setLocation(location: LocationCross){
        this.location = location;
    }

    public getLocation(){
        return this.location;
    }

    public getCoordinates(): L.LatLng{
        return this.coordinates;
    }

    public setState(state : StateMarker){
        this.state = state;
    }

    public getState(): StateMarker{
        return this.state;
    }

    public getCarsCountByKey(street: string){
        return this.carsCount.get(street);
    }

    public getCarsCount(): Map<string,number>{
        return this.carsCount;
    }

    public setCarsCount(street: string, count :number){
        this.carsCount.set(street, count);
    }

    public getVehicleCount():Map<string, number>{
        return this.vehicleCount;
    }

    public setVehicleCount(street: string, count: number){
        this.vehicleCount.set(street, count);
    }

    public setDirection(directions: Array<mapStreet>){
        this.directions = directions;
    }

    public getDirections(): Array<mapStreet>{
        return this.directions;
    }

    public setTime(time: string){
        this.timeCount = time;
    }

    public getTime(): string{
        return this.timeCount;
    }
    public static getById(id:number):Crosses{
        return Crosses.allEnums.filter(ele=> ele.id==id)[0];
    }
}
