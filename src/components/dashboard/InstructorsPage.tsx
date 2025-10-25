'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Linkedin, Award, BookOpen, Star, Clock, MessageSquare } from 'lucide-react';

const InstructorsPage = () => {
  const instructors = [
    {
      name: 'Kübra Bilgiç',
      title: 'Senior Cloud Solutions Architect',
      company: 'Huawei Türkiye',
      experience: '8+ yıl',
      specialization: 'Kubernetes, Cloud Native, DevOps',
      bio: 'Huawei Cloud ekosisteminde 8 yıllık deneyime sahip. Kubernetes ve container orkestrasyonu konularında uzman. 50+ büyük ölçekli projede liderlik yapmış.',
      achievements: [
        'Huawei Cloud Certified Expert',
        'Kubernetes Certified Administrator',
        '50+ Enterprise Proje Lideri'
      ],
      contact: {
        email: 'kubra.bilgic@huawei.com',
        linkedin: 'https://linkedin.com/in/kubrabilgic'
      },
      avatar: '/images/instructors/kubra-bilgic.jpg',
      rating: 4.9,
      students: 500
    },
    {
      name: 'Enes Cıkcık',
      title: 'Cloud Platform Engineer',
      company: 'Huawei Türkiye',
      experience: '6+ yıl',
      specialization: 'Huawei Cloud, CCE, Container Technologies',
      bio: 'Huawei Cloud platformunda 6 yıllık deneyim. CCE (Cloud Container Engine) ve Huawei Cloud servisleri konularında uzman. Open source projelere aktif katkıda bulunuyor.',
      achievements: [
        'Huawei Cloud Certified Professional',
        'CNCF Ambassador',
        'Open Source Contributor'
      ],
      contact: {
        email: 'enes.cikcik@huawei.com',
        linkedin: 'https://linkedin.com/in/enescikcik'
      },
      avatar: '/images/instructors/enes-cikcik.jpg',
      rating: 4.8,
      students: 300
    },
    {
      name: 'Buse İpek Nacaroğlu',
      title: 'DevOps & Cloud Solutions Specialist',
      company: 'Huawei Türkiye',
      experience: '5+ yıl',
      specialization: 'DevOps, CI/CD, Infrastructure as Code',
      bio: 'DevOps kültürü ve modern yazılım geliştirme süreçleri konularında uzman. Infrastructure as Code ve otomasyon konularında 5 yıllık deneyim.',
      achievements: [
        'Huawei Cloud Certified Associate',
        'AWS Certified DevOps Engineer',
        'Terraform Certified'
      ],
      contact: {
        email: 'buse.nacaroglu@huawei.com',
        linkedin: 'https://linkedin.com/in/buseipeknacaroglu'
      },
      avatar: '/images/instructors/buse-nacaroglu.jpg',
      rating: 4.9,
      students: 400
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      
        
        <p className="text-lg text-gray-600 leading-relaxed">
          Alanında uzman eğitmenlerimizden eğitim alın. Her biri kendi alanında deneyimli ve sertifikalı.
        </p>
      

      {/* Instructors Grid */}
      <div className="grid lg:grid-cols-1 gap-8">
        {instructors.map((instructor, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Avatar and Basic Info */}
              <div className="lg:w-1/3">
                <div className="text-center lg:text-left">
                  <div className="w-32 h-32 bg-gray-200 rounded-2xl mx-auto lg:mx-0 mb-6 flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{instructor.name}</h2>
                  <p className="text-lg text-red-600 font-semibold mb-1">{instructor.title}</p>
                  <p className="text-gray-600 mb-4">{instructor.company}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-semibold">{instructor.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{instructor.students} öğrenci</span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2">
                    <a
                      href={`mailto:${instructor.contact.email}`}
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{instructor.contact.email}</span>
                    </a>
                    <a
                      href={instructor.contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="text-sm">LinkedIn Profili</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Detailed Info */}
              <div className="lg:w-2/3">
                <div className="space-y-6">
                  {/* Experience & Specialization */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-gray-900">Deneyim</span>
                      </div>
                      <p className="text-gray-600">{instructor.experience}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-gray-900">Uzmanlık</span>
                      </div>
                      <p className="text-gray-600">{instructor.specialization}</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Hakkında</h3>
                    <p className="text-gray-600 leading-relaxed">{instructor.bio}</p>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Başarılar & Sertifikalar</h3>
                    <div className="space-y-2">
                      {instructor.achievements.map((achievement, achievementIndex) => (
                        <div key={achievementIndex} className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200 text-center"
      >
        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Eğitmenlerle İletişim</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Eğitmenlerimizle doğrudan iletişime geçebilir, sorularınızı sorabilir ve mentorluk desteği alabilirsiniz.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
            Eğitmenlerle İletişime Geç
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InstructorsPage;
