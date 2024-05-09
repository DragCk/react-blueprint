
const ModelDatas = {
    cabinet: {
        path:"./cabinet/cabinet.glb", 
        scale: 2.5,
        name:"Cabinet", 
        textureRepeat : false,
        texture:[{
                    map: "./cabinet/1/tu_BaseColor.png",
                    normalMap: "./cabinet/1/tu_Normal.png",
                    roughnessMap: "./cabinet/1/tu_Roughness.png",
                    metalnessMap: "./cabinet/1/tu_Metallic.png",
                    displacementMap: "./cabinet/1/tu_Displacement.png",
                },{
                    map: "./cabinet/2/tu_BaseColor.png",
                    normalMap: "./cabinet/2/tu_Normal.png",
                    roughnessMap: "./cabinet/2/tu_Roughness.png",
                    metalnessMap: "./cabinet/2/tu_Metallic.png",
                    displacementMap: "./cabinet/2/tu_Displacement.png",
                },{
                    map: "./cabinet/3/tu_BaseColor.png",
                    normalMap: "./cabinet/3/tu_Normal.png",
                    roughnessMap: "./cabinet/3/tu_Roughness.png",
                    metalnessMap: "./cabinet/3/tu_Metallic.png",
                    displacementMap: "./cabinet/3/tu_Displacement.png",
                }]
        },
    sofa: { 
        path: "./Sofa/untitled.gltf", 
        scale: 5,
        name:"Sofa",
        textureRepeat : true,
        texture:[{
                    map:"./Sofa/sofa_Grey cloth_BaseColor.png",
                    normalMap: "./Sofa/sofa_Grey cloth_Normal.png",
                    metalnessMap: "./Sofa/sofa_Grey cloth_Metallic_png-sofa_Grey cloth_Roughness_png.png",
                },
                {
                    map: "./Sofa/sofa_Reflecting wood_BaseColor.png",
                    metalnessMap: "./Sofa/sofa_Reflecting wood_Metallic-sofa_Reflecting wood_Roughness.png",
                }]
     }
}



export default ModelDatas