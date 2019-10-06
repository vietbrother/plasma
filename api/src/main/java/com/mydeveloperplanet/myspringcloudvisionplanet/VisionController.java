//package com.mydeveloperplanet.myspringcloudvisionplanet;
//
//import com.google.api.client.util.Base64;
//import com.google.cloud.vision.v1.*;
//import com.google.gson.Gson;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.cloud.gcp.vision.CloudVisionTemplate;
//import org.springframework.core.io.Resource;
//import org.springframework.core.io.ResourceLoader;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import javax.imageio.ImageIO;
//import java.awt.*;
//import java.awt.image.BufferedImage;
//import java.io.File;
//import java.io.FileOutputStream;
//import java.io.IOException;
//import java.io.OutputStream;
//import java.nio.file.Path;
//import java.util.List;
//
//@RestController
//public class VisionController {
//
//    @Autowired
//    private ResourceLoader resourceLoader;
//
//    @Autowired
//    private CloudVisionTemplate cloudVisionTemplate;
//
//    @RequestMapping("/getLabelDetection")
//    public String getLabelDetection() {
//
//        Resource imageResource = this.resourceLoader.getResource("file:src/main/resources/cat.jpg");
//        AnnotateImageResponse response = this.cloudVisionTemplate.analyzeImage(imageResource,
//                Feature.Type.LABEL_DETECTION);
//
//        return response.getLabelAnnotationsList().toString();
//    }
//
//    @RequestMapping(value = "/getTextDetection", method = RequestMethod.POST, produces = "application/json")
//    public String getTextDetection(@RequestParam("image") String imageStr) {
//        String currDir = new File("").getAbsolutePath();
//        System.out.println(currDir);
//        System.out.println("=============================================================");
//        String dirPath = "";
//        String fileName = System.nanoTime() + ".png";
//        String fullPath = "";
//        try {
//            byte[] data = Base64.decodeBase64(imageStr);
//            File dir = new File(currDir + "/temp/");
//            if (!dir.exists()) {
//                dir.mkdirs();
//            }
//            fullPath = dir + "/" + fileName;
//            FileOutputStream fos = new FileOutputStream(new File(fullPath));
//            fos.write(data);
//            fos.close();
//            System.out.println(fullPath + "=============================================================");
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        try {
//            Resource imageResource = this.resourceLoader.getResource("file:" + fullPath);
//            AnnotateImageResponse response1 = this.cloudVisionTemplate.analyzeImage(imageResource,
//                    Feature.Type.TEXT_DETECTION);
//            Gson gson = new Gson();
//            String json = gson.toJson(response1.getTextAnnotationsList());
//            System.out.println(json);
//            return json;
//
//        } catch (Exception e) {
//            // TODO: handle exception
//            e.printStackTrace();
//            return e.getMessage();
//        }
//
//    }
//
//    @RequestMapping(value = "/getTextDocumentDetection", method = RequestMethod.POST, produces = "application/json")
//    public String getTextDocumentDetection(@RequestParam("image") String imageStr) {
//        String currDir = new File("").getAbsolutePath();
//        System.out.println(currDir);
//        System.out.println("getTextDocumentDetection=============================================================");
//        String dirPath = "";
//        String fileName = System.nanoTime() + ".png";
//        String fullPath = "";
//        try {
//            byte[] data = Base64.decodeBase64(imageStr);
//            File dir = new File(currDir + "/temp/");
//            if (!dir.exists()) {
//                dir.mkdirs();
//            }
//            fullPath = dir + "/" + fileName;
//            FileOutputStream fos = new FileOutputStream(new File(fullPath));
//            fos.write(data);
//            fos.close();
//            System.out.println(fullPath + "=============================================================");
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        try {
//            Resource imageResource = this.resourceLoader.getResource("file:" + fullPath);
//            AnnotateImageResponse response = this.cloudVisionTemplate.analyzeImage(imageResource,
//                    Feature.Type.DOCUMENT_TEXT_DETECTION);
//            Gson gson = new Gson();
//            String json = gson.toJson(response.getTextAnnotationsList());
//            System.out.println(json);
//            return json;
//
//        } catch (Exception e) {
//            // TODO: handle exception
//            e.printStackTrace();
//            return e.getMessage();
//        }
//
//    }
//
//    @RequestMapping("/getLandmarkDetection")
//    public String getLandmarkDetection() {
//
//        Resource imageResource = this.resourceLoader.getResource("file:src/main/resources/landmark.jpeg");
//        AnnotateImageResponse response = this.cloudVisionTemplate.analyzeImage(imageResource,
//                Feature.Type.LANDMARK_DETECTION);
//
//        return response.getLandmarkAnnotationsList().toString();
//    }
//
//    @RequestMapping("/getFaceDetection")
//    public String getFaceDetection() throws IOException {
//
//        Resource imageResource = this.resourceLoader.getResource("file:src/main/resources/faces.jpeg");
//        Resource outputImageResource = this.resourceLoader.getResource("file:src/main/resources/output.jpg");
//        AnnotateImageResponse response = this.cloudVisionTemplate.analyzeImage(imageResource,
//                Feature.Type.FACE_DETECTION);
//
//        writeWithFaces(imageResource.getFile().toPath(), outputImageResource.getFile().toPath(),
//                response.getFaceAnnotationsList());
//
//        return response.getFaceAnnotationsList().toString();
//    }
//
//    /**
//     * Reads image {@code inputPath} and writes {@code outputPath} with
//     * {@code faces} outlined.
//     */
//    private static void writeWithFaces(Path inputPath, Path outputPath, List<FaceAnnotation> faces) throws IOException {
//        BufferedImage img = ImageIO.read(inputPath.toFile());
//        annotateWithFaces(img, faces);
//        ImageIO.write(img, "jpg", outputPath.toFile());
//    }
//
//    /**
//     * Annotates an image {@code img} with a polygon around each face in
//     * {@code faces}.
//     */
//    public static void annotateWithFaces(BufferedImage img, List<FaceAnnotation> faces) {
//        for (FaceAnnotation face : faces) {
//            annotateWithFace(img, face);
//        }
//    }
//
//    /**
//     * Annotates an image {@code img} with a polygon defined by {@code face}.
//     */
//    private static void annotateWithFace(BufferedImage img, FaceAnnotation face) {
//        Graphics2D gfx = img.createGraphics();
//        Polygon poly = new Polygon();
//        for (Vertex vertex : face.getFdBoundingPoly().getVerticesList()) {
//            poly.addPoint(vertex.getX(), vertex.getY());
//        }
//        gfx.setStroke(new BasicStroke(5));
//        gfx.setColor(new Color(0x00ff00));
//        gfx.draw(poly);
//    }
//
//}
